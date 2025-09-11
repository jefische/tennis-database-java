# Tennis Database - Full Stack Application

A comprehensive tennis database management system built with modern web technologies.

## Tech Stack

### Frontend
- **React** - Modern JavaScript library for building user interfaces
- **HTML/CSS/JavaScript** - Core web technologies

### Backend
- **Java Spring Boot** - Robust backend framework for RESTful APIs
- **Spring Data JPA** - Data persistence layer
- **Maven** - Dependency management

## Features

- Player management and statistics
- Match recording and tracking
- Tournament organization
- Real-time data updates
- Responsive web interface

## Getting Started

### Prerequisites
- Node.js (v14+)
- Java 11+
- Maven 3.6+

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd tennis-database-java
```

2. Start the backend
```bash
cd backend
mvn spring-boot:run
```

3. Start the frontend
```bash
cd frontend
npm install
npm start
```

## API Documentation

The REST API runs on `http://localhost:8080` with endpoints for:
- `/videos` - Get all videos
- `/videos/add` - Add new video
- `/videos/{youtubeId}` - Get/delete specific video
- `/videos/edit` - Update video

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

To run the Aiven MySQL db set to production in CLI and this will override the .env settings. Or just set the .env variable
# Linux
```bash
mvn spring-boot:run -Dspring.profiles.active=production
```

# Windows
```bash
set SPRING_PROFILES_ACTIVE=production
mvn spring-boot:run
```

### Production
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