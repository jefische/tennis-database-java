# Implementation Plan: LangChain Match Summary Integration

## Overview
Integrate LangChain-based match summary generation with the Tennis Database application. Creates a Node.js/TypeScript service running locally alongside the Spring Boot backend, adds a `summary` field to the Video model, and implements a manual button-triggered summary generation flow.

## Architecture Decision

**Chosen Approach: Spring Boot → Local Node.js Service (HTTP)**

```
┌─────────────┐     HTTP      ┌──────────────┐     HTTP      ┌──────────────┐
│   React     │──────────────>│ Spring Boot  │──────────────>│  Node.js     │
│  Frontend   │<──────────────│   Backend    │<──────────────│  LangChain   │
└─────────────┘               └──────────────┘               │   Service    │
      │                              │                       └──────────────┘
      │                              │                             │
      │                              ▼                             │
      │                        ┌──────────────┐                    │
      │                        │    MySQL     │                    │
      │                        │   Database   │                    │
      └───────────────────────>│   (Aiven)    │<───────────────────┘
                               └──────────────┘
```

**Why this approach:**
- Clean separation of concerns (Java for CRUD, Node.js for AI)
- LangChain only available in TypeScript/Python
- Local development focus (no deployment complexity yet)
- Spring Boot familiar with HTTP client calls
- Easy to deploy to separate Fly.io app later

## Phase 1: Create Node.js LangChain Service

### 1.1 Create Service Directory Structure

```
tennis-database-java/
├── client/
├── server/
└── summary-service/          # NEW
    ├── package.json
    ├── tsconfig.json
    ├── .env
    ├── src/
    │   ├── index.ts          # Express server
    │   ├── services/
    │   │   └── summaryService.ts    # LangChain logic
    │   └── config/
    │       └── database.ts   # MySQL connection
    └── dist/                 # Compiled output
```

### 1.2 Initialize Node.js Service

Create `summary-service/package.json`:
```json
{
  "name": "tennis-summary-service",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@langchain/core": "^1.1.17",
    "@langchain/community": "^1.1.7",
    "@langchain/google-genai": "^2.1.13",
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0"
  }
}
```

### 1.3 Implement Summary Service

**File: `summary-service/src/services/summaryService.ts`**

Core logic:
1. Accept `youtubeUrl` as input
2. Use `YoutubeLoader` from LangChain to fetch transcript
3. Create `ChatPromptTemplate` with tennis analyst system prompt
4. Invoke `ChatGoogleGenerativeAI` model (gemini-2.5-flash)
5. Return summary string (50-100 words)

**File: `summary-service/src/index.ts`**

Express server:
- `POST /api/summary` endpoint
- Request body: `{ youtubeUrl: string }`
- Response: `{ summary: string }` or error
- Port: 3001 (to avoid conflict with Spring Boot 8080, Vite 5173)
- CORS enabled for localhost:8080

### 1.4 Database Connection (Optional for Future)

**File: `summary-service/src/config/database.ts`**

MySQL connection using same Aiven credentials:
- Initially not used (Spring Boot handles DB updates)
- Ready for future direct database access if needed

### 1.5 Environment Configuration

**File: `summary-service/.env`**
```env
PORT=3001
GOOGLE_API_KEY=<your_gemini_api_key>

# Database credentials (same as Spring Boot)
DB_HOST=<aiven_host>
DB_PORT=<aiven_port>
DB_NAME=<aiven_db_name>
DB_USER=<aiven_user>
DB_PASSWORD=<aiven_password>
```

## Phase 2: Update Spring Boot Backend

### 2.1 Add Summary Field to Video Model

**File: `server/src/main/java/com/tennisdb/server/model/Video.java`**

Add new field:
```java
@Column(columnDefinition = "TEXT")
private String summary;
```

This requires a database migration (Hibernate will handle with `ddl-auto=update` in development).

### 2.2 Create DTO for Summary Request/Response

**File: `server/src/main/java/com/tennisdb/server/dto/SummaryRequest.java`**
```java
public class SummaryRequest {
    private String youtubeUrl;
    // Getters, setters, constructors
}
```

**File: `server/src/main/java/com/tennisdb/server/dto/SummaryResponse.java`**
```java
public class SummaryResponse {
    private String summary;
    // Getters, setters, constructors
}
```

### 2.3 Add HTTP Client Configuration

**File: `server/src/main/java/com/tennisdb/server/config/RestTemplateConfig.java`** (NEW)

Configure Spring `RestTemplate` bean for HTTP calls to Node.js service:
```java
@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

### 2.4 Create Summary Service

**File: `server/src/main/java/com/tennisdb/server/service/SummaryService.java`** (NEW)

Methods:
1. `generateSummary(String youtubeUrl)` - Calls Node.js service via RestTemplate
2. `saveSummaryToVideo(String youtubeId, String summary)` - Updates Video entity with summary

Logic:
- POST to `http://localhost:3001/api/summary` with youtubeUrl
- Parse response JSON to get summary string
- Update Video in database using VideoRepository
- Handle errors (Node.js service down, API failure, invalid video ID)

### 2.5 Add Controller Endpoint

**File: `server/src/main/java/com/tennisdb/server/controller/VideoController.java`**

Add new endpoint:
```java
@PostMapping(value = "videos/summary")
public ResponseEntity<?> generateVideoSummary(@RequestBody SummaryRequest request) {
    try {
        // Extract video ID from URL
        String youtubeId = extractYoutubeId(request.getYoutubeUrl());

        // Check if video exists
        Optional<Video> videoOpt = videoService.getVideoByYoutubeId(youtubeId);
        if (!videoOpt.isPresent()) {
            return ResponseEntity.status(404)
                .body(new ErrorResponse(404, "Video not found"));
        }

        // Generate summary via Node.js service
        String summary = summaryService.generateSummary(request.getYoutubeUrl());

        // Save to database
        summaryService.saveSummaryToVideo(youtubeId, summary);

        // Return summary
        return ResponseEntity.ok(new SummaryResponse(summary));
    } catch (Exception e) {
        return ResponseEntity.status(500)
            .body(new ErrorResponse(500, "Failed to generate summary: " + e.getMessage()));
    }
}
```

Helper method:
```java
private String extractYoutubeId(String url) {
    // Regex to extract video ID from YouTube URL
    // Returns just the ID (e.g., "ckbX699wngs")
}
```

### 2.6 Environment Configuration

**File: `server/.env`**

Add:
```env
SUMMARY_SERVICE_URL=http://localhost:3001
```

Load in `application.properties`:
```properties
summary.service.url=${SUMMARY_SERVICE_URL:http://localhost:3001}
```

## Phase 3: Update Frontend

### 3.1 Frontend Already Prepared

**File: `client/src/utils/matchSummaryAgent.ts`**

✅ Already implemented correctly:
- Calls `POST /videos/summary`
- Sends `{ youtubeUrl }`
- Returns `summary` string

No changes needed.

### 3.2 Add UI Button Component

**Location: Choose where to add button**

Options:
1. **VideoCard component** (`client/src/components/home/modals/VideoCard.tsx`) - Add "Generate Summary" button to each video card
2. **EditModal component** (`client/src/components/home/modals/EditModal.tsx`) - Add to edit form
3. **New SummaryModal component** - Dedicated modal for summary generation

**Recommended: Add to VideoCard**

Add button:
```tsx
<button onClick={() => handleGenerateSummary(video.youtubeId)}>
  Generate Summary
</button>
```

Handle state:
```tsx
const [summary, setSummary] = useState<string>(video.summary || "");
const [loading, setLoading] = useState<boolean>(false);

const handleGenerateSummary = async (youtubeId: string) => {
  try {
    setLoading(true);
    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    const generatedSummary = await generateMatchSummary(youtubeUrl);
    setSummary(generatedSummary);

    // Optionally: Update parent state to refresh video list
    // This requires callback prop from Home component
  } catch (error) {
    console.error("Failed to generate summary:", error);
    alert("Failed to generate summary. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

Display summary:
```tsx
{summary && (
  <div className="summary">
    <h4>Match Summary:</h4>
    <p>{summary}</p>
  </div>
)}
```

### 3.3 Type Definitions

**File: `client/src/assets/types/callbacks.ts` or new types file**

Ensure `Video` type includes optional `summary` field:
```typescript
export interface Video {
  videoId: number;
  youtubeId: string;
  tournament: string;
  year: number;
  player1: string;
  player2: string;
  title: string;
  round: string;
  summary?: string;  // NEW
}
```

## Phase 4: Database Migration

### 4.1 Development Database

Spring Boot Hibernate will automatically add the `summary` column when you start the server with `spring.jpa.hibernate.ddl-auto=update`.

**Expected DDL:**
```sql
ALTER TABLE video ADD COLUMN summary TEXT;
```

### 4.2 Production Database (Manual Migration)

For production, manually run migration on Aiven MySQL:

```sql
ALTER TABLE video ADD COLUMN summary TEXT;
```

Or update `spring.jpa.hibernate.ddl-auto=update` in production (risky, not recommended).

## Phase 5: Testing & Verification

### 5.1 Start All Services

Terminal 1 - Node.js Service:
```bash
cd summary-service
npm install
npm run dev
```
Expected: Server running on http://localhost:3001

Terminal 2 - Spring Boot Backend:
```bash
cd server
mvn spring-boot:run
```
Expected: Server running on http://localhost:8080

Terminal 3 - React Frontend:
```bash
cd client
npm run dev
```
Expected: Dev server running on http://localhost:5173

### 5.2 Test Summary Service Directly

Use curl or Postman:
```bash
curl -X POST http://localhost:3001/api/summary \
  -H "Content-Type: application/json" \
  -d '{"youtubeUrl": "https://www.youtube.com/watch?v=ckbX699wngs"}'
```

Expected response:
```json
{
  "summary": "In a thrilling match at the 2023 Wimbledon final, Carlos Alcaraz defeated Novak Djokovic 1-6, 7-6(6), 6-1, 3-6, 6-4. The young Spaniard's aggressive baseline play and remarkable court coverage proved pivotal in the fourth and fifth sets..."
}
```

### 5.3 Test Spring Boot Endpoint

```bash
curl -X POST http://localhost:8080/videos/summary \
  -H "Content-Type: application/json" \
  -d '{"youtubeUrl": "https://www.youtube.com/watch?v=ckbX699wngs"}'
```

Verify:
1. Returns summary in response
2. Summary saved to database (check MySQL or GET /videos/{youtubeId})

### 5.4 Test Frontend UI

1. Navigate to http://localhost:5173
2. Find a video card
3. Click "Generate Summary" button
4. Verify:
   - Loading state shows
   - Summary appears after ~3-5 seconds
   - Summary persists in database (refresh page, summary still there)
   - Error handling works (try with invalid video URL)

### 5.5 Database Verification

Check that summary column exists and contains data:
```sql
SELECT youtubeId, title, summary FROM video WHERE summary IS NOT NULL LIMIT 5;
```

### 5.6 Error Handling Tests

Test scenarios:
1. Node.js service down → Spring Boot returns 500 error
2. Invalid YouTube URL → Node.js returns error
3. No transcript available → LangChain error
4. Video not in database → Spring Boot returns 404
5. Gemini API key missing/invalid → Node.js returns error

## Critical Files to Modify

**New Files:**
- `summary-service/package.json`
- `summary-service/tsconfig.json`
- `summary-service/.env`
- `summary-service/src/index.ts`
- `summary-service/src/services/summaryService.ts`
- `summary-service/src/config/database.ts`
- `server/src/main/java/com/tennisdb/server/config/RestTemplateConfig.java`
- `server/src/main/java/com/tennisdb/server/service/SummaryService.java`
- `server/src/main/java/com/tennisdb/server/dto/SummaryRequest.java`
- `server/src/main/java/com/tennisdb/server/dto/SummaryResponse.java`

**Modified Files:**
- `server/src/main/java/com/tennisdb/server/model/Video.java` - Add summary field
- `server/src/main/java/com/tennisdb/server/controller/VideoController.java` - Add /videos/summary endpoint
- `server/src/main/resources/application.properties` - Add summary service URL config
- `server/.env` - Add SUMMARY_SERVICE_URL
- `client/src/components/home/modals/VideoCard.tsx` (or chosen component) - Add UI button
- `client/src/assets/types/callbacks.ts` - Add summary field to Video interface

**No Changes Needed:**
- `client/src/utils/matchSummaryAgent.ts` - Already correct

## Future Enhancements

After local implementation works:

1. **Deployment**: Create separate Fly.io app for summary-service
2. **Caching**: Cache summaries to avoid regeneration
3. **Batch Processing**: Generate summaries for multiple videos
4. **Background Jobs**: Queue summary generation with Bull/Redis
5. **Advanced Prompts**: Add more detailed analysis (set analysis, statistics)
6. **Error Retry Logic**: Exponential backoff for failed API calls
7. **Rate Limiting**: Prevent abuse of Gemini API
8. **Summary Versioning**: Track prompt changes and regenerate old summaries

## Estimated Time

- Node.js service setup: 1-2 hours
- Spring Boot backend changes: 2-3 hours
- Frontend UI integration: 1-2 hours
- Testing and debugging: 1-2 hours

**Total: 5-9 hours**

## Dependencies to Install

**Node.js Service:**
```bash
npm install express cors dotenv mysql2 @langchain/core @langchain/community @langchain/google-genai
npm install -D typescript tsx @types/express @types/cors
```

**Spring Boot:** (Maven will resolve)
- No new dependencies (RestTemplate is part of spring-boot-starter-web)

**Frontend:**
- Already has all LangChain dependencies installed
