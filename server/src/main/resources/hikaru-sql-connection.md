It's not a **cold** start from fly.io. Look at the timeline:

15:58:42 — machine resumes (suspend restore worked, 282ms)
15:58:55 — first Hikari validation fails (13s later)
15:59:05 — second validation fails (another 10s)
15:59:05 — query finally runs (~23s total)
No Spring Boot startup logs = suspend is working as intended. The JVM resumed instantly. The entire ~20s delay is HikariCP fighting with dead MySQL connections.

What's happening
When Fly suspends your machine, it freezes the JVM's memory including open TCP sockets to Aiven MySQL. When it resumes, the JVM thinks those connections are still alive, but Aiven closed them on its side long ago (idle timeout). So:

1. Request comes in → Hikari hands out a "connection" from the pool
2. Connection is dead → No operations allowed after connection closed
3. Hikari waits ~10s (default validation/connect timeout), retries
4. Gets another dead one → another 10s
5. Finally opens a fresh connection → query runs

Each dead connection in the pool costs you ~10 seconds.

## Fix

Add these to `application-production.properties` (and development if you want):


Test connections before handing them out (catches dead sockets immediately)
`spring.datasource.hikari.connection-test-query=SELECT 1`

Keep connections short-lived so they're more likely fresh
`spring.datasource.hikari.max-lifetime=120000`
`spring.datasource.hikari.idle-timeout=60000`

Fail fast on bad connections instead of waiting 10s
`spring.datasource.hikari.validation-timeout=2000`
`spring.datasource.hikari.connection-timeout=5000`

Small pool — you don't need many for this app
`spring.datasource.hikari.maximum-pool-size=3`
`spring.datasource.hikari.minimum-idle=0`

The key ones:

- `minimum-idle=0` — don't keep idle connections around to go stale during suspend. Open fresh ones on demand.
- `max-lifetime=120000` (2min) — shorter than Aiven's server-side timeout, so Hikari retires them before Aiven does.
- `validation-timeout=2000` — don't spend 10s probing a dead connection.

## Even better: skip the validation dance entirely

Since `minimum-idle=0` means the pool starts empty after a period of inactivity, the first request will open a brand new connection — no dead sockets to wade through. That alone should drop your wake time from ~20s to ~1–2s (just the TLS handshake to Aiven).

Note that `minimum-idle` is a count, not a duration. It's the minimum number of idle connections Hikari tries to keep in the pool at all times.

- `minimum-idle=2` → Hikari keeps at least 2 idle connections ready, even when nothing is using them
- `minimum-idle=0` → pool can shrink to empty when idle (best for your suspend setup)

The duration settings are separate:

- `idle-timeout` (ms) — how long a connection can sit idle before being removed (only applies to connections above `minimum-idle`)
- `max-lifetime` (ms) — hard cap on total connection age, regardless of idle state. Retired and replaced after this.

For your case with suspend, you want `minimum-idle=0` so no connections are sitting around to get killed during suspension.