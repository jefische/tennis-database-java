# You have a couple of options for custom credentials (username/password auth) with Spring Boot:

## 1. Spring Security with a database-backed user store — Most common approach. You'd:

- Add spring-boot-starter-security
- Create a User entity/table with hashed passwords (BCrypt)
- Implement UserDetailsService to load users from your DB
- Configure a SecurityFilterChain for login/logout and protected routes

## 2. JWT-based auth — Better for your React SPA since it's stateless:

- User logs in with credentials → backend returns a JWT
- React stores the token and sends it in Authorization: Bearer <token> headers
- Spring Security filter validates the JWT on each request
- No server-side session needed
- For your project (React frontend + Spring Boot API), JWT-based auth is the typical choice since your frontend and backend are separate services.

The flow would be:

- POST /auth/register — create account (hashed password stored in DB)
- POST /auth/login — verify credentials, return JWT
- Protected endpoints (add/edit/delete videos) require a valid JWT header
- React stores the JWT (localStorage or httpOnly cookie) and attaches it to API calls

# Clarification

Database-backed user store = where user credentials are stored (a `users` table with hashed passwords). This is what you implemented with `User`, `UserRepository`, and `CustomUserDetailsService`.

**JWT vs Session** = how the server remembers that a user is authenticated across requests after they log in.

So you're actually using **both**: database-backed user storage **and** JWT for session management. The real comparison is:

## JWT vs Server-Side Sessions
### Server-side sessions (traditional Spring Security default):

- User logs in → server creates a session, stores it in memory/Redis, sends a session ID cookie
- Every request sends the cookie → server looks up the session data
- **Pros**: Easy to invalidate (just delete the session), can store arbitrary data server-side
- **Cons**: Requires server memory/storage, doesn't scale horizontally without shared session store (Redis), cookies can have CORS/CSRF issues with separate frontend domains

### JWT (what you built):

- User logs in → server returns a signed token, nothing stored server-side
- Every request sends `Authorization: Bearer <token>` → server verifies signature

- **Pros**:
    - **Stateless** — no session storage needed, easy to scale across multiple servers
    - **Works well with SPAs** — React sends the token in a header, no cookie/CSRF complications
    - **Decoupled frontend/backend** — your React app could even live on a different domain
    - **Mobile-friendly** — native mobile apps can easily include headers but struggle with cookies
- **Cons**:
    - **Hard to invalidate** — tokens stay valid until they expire (you can't "log out" a token server-side without a blacklist)
    - **Larger requests** — the token travels on every request
    - **Secret management** — if JWT_SECRET leaks, every token can be forged