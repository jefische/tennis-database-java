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
- `/api/players` - Player management
- `/api/matches` - Match data
- `/api/tournaments` - Tournament information

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

To run the Aiven MySQL db set to production in CLI and this will override the .env settings:
# Linux
```bash
mvn spring-boot:run -Dspring.profiles.active=production
```

# Windows
```bash
set SPRING_PROFILES_ACTIVE=production
mvn spring-boot:run
```