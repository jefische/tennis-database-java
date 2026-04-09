### Fly commands
```bash
fly version
fly apps list
fly apps open -a <app-name> (e.g. fly apps open -a tennis-database)
fly auth login
fly auth logout
fly auth whoami # check if I'm logged in
fly auth token # to output my token to the console

#Fly Secrets are injected at runtime (not build time)
fly secrets import < server/.env # to import the server env variables
fly secrets set DB_CA="$(cat server/src/main/resources/ca.pem | base64 -w 0)" # This sets ca.pem as a fly secret and encodes the certificate (base64 encoded)

fly doctor
# fly doctor is a diagnostic command from Fly.io that checks your app's health and deployment readiness. It runs through several checks:

    # App-specific checks — verifies your app has IP addresses allocated and DNS records (A/AAAA) are resolving correctly for your-app.fly.dev
    # Build checks — validates that Docker can build your app by checking the context size, Dockerfile validity, etc.

# It's useful for catching issues before you deploy — like misconfigured DNS, missing IPs, bloated Docker contexts (as you just experienced), or Dockerfile problems. Think of it as a pre-flight check for fly deploy

```

To run the Aiven MySQL db, set to production in CLI and this will override the .env settings. Or just set the .env variable
# Linux
```bash
mvn spring-boot:run -Dspring.profiles.active=production
```

# Windows
```bash
set SPRING_PROFILES_ACTIVE=production
mvn spring-boot:run
```