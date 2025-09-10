# Tennis Database AI Coding Assistant Instructions

## Project Architecture

This is a **monorepo full-stack tennis video database** with React frontend and Spring Boot backend:

- `client/` - React frontend (Vite + Tailwind CSS + Bootstrap) on port 5173
- `server/` - Spring Boot backend (Maven + H2 database) on port 8080

## Critical Development Workflows

### Starting the Application
```bash
# Backend (from server/ directory)
mvn spring-boot:run

# Frontend (from client/ directory) 
npm run dev
```

### Database Management
- H2 in-memory database resets on restart (`create-drop` mode)
- Access H2 console at `http://localhost:8080/h2-console`
- Initial data loaded from `server/src/main/resources/data.sql`
- Entity-first approach: JPA creates tables, then SQL inserts data

## Project-Specific Conventions

### Java Backend Structure
- **Package naming**: `com.tennisdb.server.{Model,Controller,Service,Repository,config}`
- **Entity patterns**: Use `@Column(name="exactName")` for all fields to avoid H2 naming conflicts
- **Reserved keyword handling**: `year` → `video_year` column mapping required for H2
- **CORS**: Global config in `server/src/main/java/com/tennisdb/server/config/CorsConfig.java`
- **DTOs**: ErrorResponse pattern for API error handling

### Frontend Patterns
- **Environment detection**: `import.meta.env.PROD` for production checks
- **API communication**: Base URL switching between localhost:8080 and production
- **Form data**: camelCase field names must match Java entity properties exactly
- **State management**: Separate `allVideos` (for filtering) and `activeVideos` (for display)

### Critical Field Mapping Issues
```javascript
// Frontend form data MUST match Java entity properties:
{
  youtubeId: "...",     // NOT youtube_id
  tournament: "...",
  year: 2024,           // Maps to video_year in database
  player1: "...", 
  player2: "..."
}
```

## Testing Patterns

### Unit Tests (`@ExtendWith(MockitoExtension.class)`)
- Use `@Mock` for dependencies, `@InjectMocks` for class under test
- Pattern: `when(mockRepo.method()).thenReturn(data)`

### Integration Tests (`@SpringBootTest`)
- Use `webEnvironment = RANDOM_PORT` for TestRestTemplate
- `@Autowired TestRestTemplate` for HTTP endpoint testing

## Database Schema Gotchas

1. **H2 Reserved Keywords**: Always escape `year` as `video_year`
2. **Naming Strategy**: Physical naming strategy prevents VIDEOID vs videoId conflicts
3. **Initialization Order**: `defer-datasource-initialization=true` ensures tables exist before data.sql runs

## Key Files to Reference

- `server/src/main/resources/application.properties` - Database and JPA configuration with extensive comments
- `server/src/main/java/com/tennisdb/server/Model/Video.java` - Entity with H2-specific column mappings
- `client/src/pages/Archive.jsx` - Main data fetching and state management patterns
- `server/src/main/java/com/tennisdb/server/config/CorsConfig.java` - Cross-origin configuration for React frontend

## Common Pitfalls

1. **Null field issues**: Ensure frontend form field names exactly match Java entity property names (camelCase)
2. **CORS errors**: Backend must allow `http://localhost:5173` origin for development
3. **Database startup**: H2 creates tables from entities, then executes data.sql - order matters
4. **VS Code Java setup**: Project requires `.vscode/settings.json` with proper source paths for "non-project file" errors
