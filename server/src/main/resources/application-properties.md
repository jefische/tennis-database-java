# Profile Section

In `application.properties` Spring picks the active profile:

```
spring.profiles.active=${SPRING_PROFILES_ACTIVE:development}
```

This reads the `SPRING_PROFILES_ACTIVE` env var, defaulting to `development`. In production, this is set to `production`, which causes Spring to load `application-production.properties` **on top of** the base `application.properties`. Properties in the profile-specific file override the base.

# JDBC Datasource Configuration (Production)

In `application-production.properties`:

```
spring.datasource.url=jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?sslMode=REQUIRED&allowPublicKeyRetrieval=true
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

- **Driver**: `com.mysql.cj.jdbc.Driver` is the MySQL Connector/J JDBC driver. Spring Boot auto-configures a `DataSource` bean using this driver.
- **URL**: A standard JDBC connection string pointing to the Aiven MySQL instance. `sslMode=REQUIRED` enforces TLS encryption.
- **Credentials**: Injected from environment variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).

# Connection Pooling (HikariCP)

HikariCP is Spring Boot's default connection pool. Instead of opening a new TCP connection to MySQL for every query, Hikari maintains a pool of reusable connections.

```
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=0
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.validation-timeout=2000
```

- `maximum-pool-size=10`: Up to 10 reusable connections.
- `minimum-idle=0`: Idle connections are closed to save resources.
- `connection-timeout=30000`: Wait up to 30 seconds for a connection from the pool before throwing an exception.
- `validation-timeout=2000`: 2 seconds to validate that a connection is still alive.

# JPA / Hibernate Configuration

```
spring.jpa.hibernate.ddl-auto=update
spring.sql.init.mode=never
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

- **`ddl-auto=update`**: On startup, Hibernate compares the `@Entity` classes to the existing database schema and applies `ALTER TABLE` statements for any new columns/tables. It never drops anything.
- **`MySQLDialect`**: Tells Hibernate to generate MySQL-compatible SQL (e.g., `AUTO_INCREMENT` instead of H2's `IDENTITY`).
- **`init.mode=never`**: Prevents Spring from running `data.sql` / `schema.sql` scripts. In development, this could be set to `always` to seed test data.

# Naming Strategies

From the base `application.properties`:

```
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
spring.jpa.hibernate.naming.implicit-strategy=org.hibernate.boot.model.naming.ImplicitNamingStrategyLegacyJpaImpl
```

- **Physical naming strategy**: `PhysicalNamingStrategyStandardImpl` preserves Java field names as-is (e.g., `youtubeId` stays `youtubeId` in the DB column, not `youtube_id`). Without this, Spring Boot's default `CamelCaseToUnderscoresNamingStrategy` would convert camelCase to snake_case.
- **Implicit naming strategy**: Controls how property names are mapped when no explicit `@Column` annotation is used.

# Entity to Table Mapping

The `Video` entity maps to the `videos` table. Key annotations:

- `@Table(name="videos")` — explicit table name
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` — uses MySQL's `AUTO_INCREMENT` for the primary key
- `@Column(name="video_year")` — remaps the `year` field to avoid reserved keyword issues in H2/MySQL
- `@Column(unique = true)` on `youtubeId` — creates a unique constraint in MySQL
- `@Column(columnDefinition = "TEXT")` on `summary` — overrides the default `VARCHAR(255)` to MySQL's `TEXT` type (~65K chars)

# Repository / Query Execution

`VideoRepository` extends `JpaRepository<Video, Integer>`. Spring Data JPA auto-generates the implementation at runtime. When `findByYoutubeId("abc")` is called, Spring Data:

1. Parses the method name into a JPQL query: `SELECT v FROM Video v WHERE v.youtubeId = ?1`
2. Hibernate translates JPQL to MySQL SQL: `SELECT * FROM videos WHERE youtubeId = ?`
3. HikariCP provides a pooled JDBC connection
4. The MySQL driver sends the SQL over TCP (with TLS) to Aiven
5. Results are mapped back to `Video` objects by Hibernate

# SQL Logging

```
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

When enabled, every generated SQL statement is printed to the console logs with formatted output. Useful for debugging but should be disabled in production for performance.

# The Full Chain

```
VideoRepository method call
  → Spring Data JPA (generates JPQL)
    → Hibernate (translates to MySQL SQL, uses MySQLDialect)
      → HikariCP (provides pooled JDBC connection)
        → MySQL Connector/J driver (sends SQL over TCP+TLS)
          → Aiven MySQL server
```

# Notes
So when the application starts locally using `mvn spring-boot:run` Maven is first downloading all dependencies from `pom.xml` which creates a global cache on my local in `~/.m2/repository`. This is different from a `node_modules` folder with javascript node packages that are installed each time per project. Note that Maven only downloads dependencies the first time (or when versions change). On subsequent runs, it resolves them from the existing .m2 cache.

Then Maven compiles my java source code into .class files and places them in the classpath at `target/classes`. From here Spring Boot takes over and starts auto-configuring beans inside the IoC container by reading from the classpath and looking for beans to register either from the code I wrote or from the dependencies I'm including. 

For example, Spring Boot auto-configures infrastructure beans like `HikariDataSource` which is because of my inclusion of the `spring-boot-starter-data-jpa` dependency which then uses the `mysql-connector-j` dependency to provide the JDBC driver that `HikariCP` uses internally to open connections along with the `spring.datasource.*` properties I defined. Also, the `EntityManagerFactory` bean is from the Hibernate `SessionFactory` which comes from the `spring-boot-starter-data-jpa` dependency and uses the `spring.jpa.*` properties I define.

The IoC container (the ApplicationContext) is a Java object living in heap memory, and all the beans it manages are also Java objects in heap memory. 

The JVM has two main memory areas:

- **Stack memory** — Short-term. Each thread gets its own stack. It holds method call frames: local variables, method arguments, and return addresses. When a method finishes, its stack frame is popped and that memory is immediately freed. Fast, but small and scoped to a single method execution.

- **Heap memory** — Longer-term. Shared across all threads. This is where objects live (anything created with `new`). Objects persist on the heap until no references point to them, at which point the garbage collector eventually reclaims the memory.

In the context of Spring:

- Your **beans** (`VideoController`, `VideoService`, `HikariDataSource`, etc.) live on the **heap** for the entire lifetime of the application since they're singletons held by the `ApplicationContext`.

- When a request comes in and your `VideoController.getVideos()` method runs, the **local variables** inside that method (like a `List<Video> results` reference) live on the **stack**. The `List` object itself and the `Video` objects are on the heap, but the reference variable pointing to them is on the stack. Once the method returns, the stack frame is gone, and if nothing else references those objects, they become eligible for garbage collection.

So stack = ephemeral per-method-call data, heap = objects that persist as long as something references them.