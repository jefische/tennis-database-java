### Fly commands
```bash
fly version
fly apps list
fly apps open -a <app-name> (e.g. fly apps open -a tennis-database)
fly auth login
fly auth logout
fly auth whoami # check if I'm logged in
fly secrets import < server/.env # to import the server env variables
fly secrets set DB_CA="$(cat server/src/main/resources/ca.pem | base64 -w 0)" # This sets ca.pem as a fly secret and encodes the certificate (base64 encoded)

#fly secrets are injected at runtime (not build time)

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