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
npm run dev
```

## API Documentation

The REST API runs on `http://localhost:8080` with endpoints for:
- `/videos` - Get all videos
- `/videos/add` - Add new video
- `/videos/{youtubeId}` - Get/delete specific video
- `/videos/edit` - Update video

## Client-Side State Management
The frontend uses React's built-in state management with `useState` and prop drilling. There is no external state library (e.g., Redux, Zustand, or Context API).

Home (Parent)
├── activeVideos, allVideos (state)
├── setVideos, setAllVideos (state setters)
│
├── Sidebar
│   ├── receives: allVideos, setVideos, initFilters
│   ├── local state: formData (filter checkboxes)
│   └── children: TournamentFilters, YearFilters
│
├── SearchBar
│   ├── receives: allVideos, setVideos
│   └── local state: query
│
├── VideoCard (mapped)
│   └── receives: setAllVideos, setVideos
│
└── AddVideoCard
    ├── receives: setAllVideos, setVideos
    ├── local state: modalIsOpen, isSubmitted
    └── child: VideoForm
        ├── receives: onFormSubmit (callback)
        └── local state: formData, formValidated


## Contributing

Pull requests are welcome. For major changes, please open an issue first.

Make sure to update dockerignore from CRLF to LF line endings for Github Actions.

