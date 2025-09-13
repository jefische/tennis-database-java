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
cd server
mvn spring-boot:run
```

3. Start the frontend
```bash
cd client
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



