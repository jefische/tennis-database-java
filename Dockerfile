# Node.js stage for React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Copy frontend package files
COPY client/package*.json ./
RUN npm install

# Copy frontend source and build
COPY client/ ./

# Build React app
RUN npm run build

# Build stage for Spring Boot
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy Maven wrapper and pom first (from server/)
COPY server/mvnw ./
COPY server/.mvn ./.mvn
COPY server/pom.xml ./

# Pre-fetch dependencies
RUN ./mvnw dependency:go-offline -B

# Copy server source
COPY server/src ./src

# Copy built frontend to Spring Boot static resources
COPY --from=frontend-build /app/dist src/main/resources/static/

# Build Spring Boot jar
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Create entrypoint script for CA decoding
RUN echo '#!/bin/sh\nset -e\n\nif [ -n "$DB_CA" ]; then\n  echo "$DB_CA" | base64 -d > /app/ca.pem\nfi\n\nexec java -Xmx512m -Dserver.address=0.0.0.0 -Dserver.port=8080 -jar app.jar' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
