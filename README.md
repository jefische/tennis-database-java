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
---

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
---

## API Documentation

The REST API runs on `http://localhost:8080`. Mutations on `/videos` return the full updated video list.

| Controller | Method & path | Access | Purpose |
| --- | --- | --- | --- |
| `VideoController` | `GET /videos` | Public | All videos |
| | `GET /videos/{youtubeId}` | Public | One video |
| | `GET /videos/duration/{youtubeId}` | Public | Look up a video's duration |
| | `GET /videosAI`, `GET /videosAI/{youtubeId}` | Public | Videos with parsed AI summaries |
| | `POST /videos/add` | Admin | Add a video (409 if duplicate) |
| | `PUT /videos/edit` | Admin | Update a video |
| | `DELETE /videos/{youtubeId}` | Admin | Delete a video |
| | `POST /api/summary/{youtubeId}` | Admin | Generate an AI match summary |
| | `POST /backfill`, `POST /backfill/durationSeconds` | Admin | One-off data backfills |
| `AuthController` | `POST /auth/register`, `POST /auth/login` | Public | Create account / log in; both return a JWT |
| `EmailController` | `POST /contact` | Public | Send a contact-form email |
| `MatchPageController` | `GET /matches/{slugAndId}` | Public | Server-rendered match page (SEO) |
| `SitemapController` | `GET /sitemap.xml` | Public | Sitemap for search engines |

Access rules are defined in `config/SecurityConfig.java`.

---

## Authentication (JWT)

The API is stateless and uses JWT bearer tokens. There are no server sessions and CSRF protection is disabled.

1. **Log in:** `POST /auth/login` checks the BCrypt-hashed password and returns `{ token, username, role }`. The token is signed with `JWT_SECRET` and carries the username (`sub`) and `role`.
2. **Store the token:** the client saves it in `localStorage` and decodes the payload into the Zustand `user`. `App.tsx` restores the user from storage on page load.
3. **Send the token:** admin requests include `Authorization: Bearer <token>`.
4. **Check the token:** `JwtAuthFilter` verifies the signature and expiry, loads the user, and sets the Spring Security context. `SecurityConfig` then requires `ROLE_ADMIN` for write endpoints.
5. **Handle failures:** an expired token returns `401 {"error": "Token expired"}`. The client clears the token and asks the user to log in again.

New accounts get the `USER` role. Promote a user to `ADMIN` directly in the database.

| Env var | Purpose |
| --- | --- |
| `JWT_SECRET` | HMAC signing key (at least 32 bytes) |
| `JWT_EXPIRATION` | Token lifetime in ms. Defaults to `86400000` (24 h). |

---

## Client-Side State Management
The frontend uses a single [Zustand](https://github.com/pmndrs/zustand) store (`client/src/hooks/useStore.ts`). Components read and update it directly with selectors, so there's no prop drilling.

The store holds source-of-truth state only. The list of videos on screen is **derived**, not stored: `useVisibleVideos()` filters, searches and sorts `allVideos` on each change.

```
useStore (Zustand)
├── state
│   ├── user                          logged-in user (role drives admin UI)
│   ├── allVideos                     full list from the API
│   ├── filterOptions                 tournament / year / tag options + counts
│   ├── selected                      active tournament / year / tag filters
│   ├── allTournaments, allYears      "select all" toggles
│   ├── searchQuery
│   └── sortMode
└── actions
    ├── setUser
    ├── setAllVideos                  stores videos and rebuilds filterOptions
    ├── dispatchFilter                applies a FilterAction via filterReducer
    ├── setSearchQuery
    └── setSortMode

useVisibleVideos()  ── allVideos → filter (selected) → search (searchQuery) → sort (sortMode)
```

Who uses what:

| Component | Reads | Writes |
| --- | --- | --- |
| `Home` | `user`, `allVideos`, `useVisibleVideos()` | `setAllVideos` (initial fetch), `setSortMode` |
| `TournamentFilters`, `YearFilters`, `TagFilters` | `filterOptions`, `selected`, `allTournaments` / `allYears` | `dispatchFilter` |
| `SearchBar` | `searchQuery` | `setSearchQuery` |
| `SCNVideoCard` | `user` | — (receives a `video` prop) |
| `RHFVideoForm`, `DeleteModal` | `user`, `allVideos` | `setAllVideos` (with the list the API returns after add/edit/delete) |
| `Navbar`, `LoginModal`, `App` | `user` | `setUser` |

Form fields and modal open/closed state stay in each component's local state.
---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

Make sure to update dockerignore from CRLF to LF line endings for Github Actions.

