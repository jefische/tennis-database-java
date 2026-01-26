# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tennis Database is a full-stack web application for managing a video archive of tennis matches. Users can browse, search, filter, and manage tennis match videos by tournament, year, players, and rounds.

**Stack:**
- Frontend: React 19 + TypeScript + Vite + Tailwind CSS 4
- Backend: Java 21 + Spring Boot 3.5.5 + Spring Data JPA
- Database: MySQL (Aiven) for production, H2 in-memory for development
- Build: Maven (backend), npm (frontend)

## Development Commands

### Backend (Spring Boot)
```bash
cd server
mvn spring-boot:run              # Start development server (port 8080)
mvn clean install                # Build project
mvn test                          # Run tests
mvn test -Dtest=VideoServiceTest  # Run single test class
```

### Frontend (React + Vite)
```bash
cd client
npm install          # Install dependencies
npm run dev          # Start development server (Vite)
npm run build        # Build for production + type check
npm run lint         # Run ESLint
```

## Architecture

### Backend Structure (Spring Boot)

The backend follows a classic layered Spring Boot architecture:

```
com.tennisdb.server/
├── controller/      # REST endpoints (VideoController)
├── service/         # Business logic (VideoService)
├── repository/      # JPA data access (VideoRepository extends JpaRepository)
├── model/           # JPA entities (Video)
├── dto/             # Data transfer objects (ErrorResponse)
└── config/          # Configuration classes (CorsConfig, WebConfig)
```

**Key Points:**
- **Video Entity**: Uses Lombok annotations (@Data, @AllArgsConstructor, @NoArgsConstructor). The `year` field is mapped to `video_year` column (H2 reserved keyword workaround). The `youtubeId` field is unique and used as the business key for lookups.
- **VideoRepository**: Custom query method `findByYoutubeId(String id)` for lookups by YouTube ID.
- **API Pattern**: All mutations (POST, PUT, DELETE) return the complete updated list of videos to the client for immediate UI updates.
- **Environment Profiles**: Uses Spring profiles (`development`, `production`) controlled by `SPRING_PROFILES_ACTIVE` env var. Development uses MySQL (Aiven), production also uses MySQL (Aiven).

### Frontend Structure (React)

```
client/src/
├── pages/                    # Route pages (Home, Players, Profile, etc.)
├── components/
│   ├── home/
│   │   ├── modals/           # VideoCard, AddVideoCard, EditModal
│   │   └── sidebar/          # Sidebar, TournamentFilters, YearFilters
│   ├── players/              # PlayerVideoCard
│   ├── profile/              # CustomVideos, ModalTest
│   ├── Navbar.tsx
│   └── SearchBar.tsx
├── assets/
│   ├── css/                  # Stylesheets
│   ├── data/                 # Static data files
│   └── types/                # TypeScript types and helpers
└── App.tsx                   # React Router setup
```

**State Management Pattern:**
- Uses React's built-in state (useState) with prop drilling - NO external state library (Redux/Zustand/Context).
- The `Home` component is the state container, managing `activeVideos` and `allVideos`.
- State setters (`setVideos`, `setAllVideos`) are passed down to child components that need to update state.
- Filtering/search operates by updating `activeVideos` while keeping `allVideos` as the source of truth.

**API Integration:**
- Base URL from environment: `import.meta.env.VITE_API_URL`
- Production mode check: `import.meta.env.PROD`
- AddVideoCard component is hidden in production builds.

### REST API Endpoints

Base URL: `http://localhost:8080`

- `GET /videos` - Retrieve all videos
- `GET /videos/{youtubeId}` - Get specific video by YouTube ID
- `POST /videos/add` - Add new video (returns full video list, 409 if duplicate)
- `PUT /videos/edit` - Update existing video (returns full video list)
- `DELETE /videos/{youtubeId}` - Delete video by YouTube ID (returns full video list)

## Configuration Notes

### Database Configuration
- **Development**: MySQL via Aiven (configured in `application-development.properties`)
- **Production**: MySQL via Aiven (configured in `application-production.properties`)
- Both profiles require environment variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- H2 in-memory database configuration is commented out but available in `application.properties`
- Naming strategy set to `PhysicalNamingStrategyStandardImpl` to preserve camelCase column names

### Environment Variables
- **Backend**: Loaded via dotenv-java library
- **Frontend**: Vite environment variables (prefixed with `VITE_`)
  - `VITE_API_URL`: Backend API base URL

## Important Patterns

1. **Video Lookups**: Always use `youtubeId` (not `videoId`) for get/update/delete operations. The `videoId` is an auto-generated database ID.

2. **Filter Data Structure**: The `VideoFilters` type uses nested objects: `{tournament: {}, year: {}}`. Filters are dynamically generated by reducing over `allVideos`.

3. **Lombok Usage**: The Video entity uses Lombok's @Data annotation which generates getters, setters, toString, equals, and hashCode. When updating Video fields in the service layer, use the generated setter methods.

4. **CORS**: Configured in `CorsConfig.java` for cross-origin requests during development.

5. **Docker**: The README mentions updating `.dockerignore` line endings from CRLF to LF for GitHub Actions compatibility.
