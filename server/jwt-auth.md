# JWT Authentication Implementation Plan

## Overview

Add JWT-based (JSON Web Token) authentication to the tennis database app. Users register/login with credentials, receive a JWT, and include it in requests to protected endpoints. Public endpoints (browsing/searching videos) remain open.

---

## Phase 1: Backend — Dependencies & User Entity

### 1.1 Add Maven Dependencies (`pom.xml`)

- `spring-boot-starter-security` — Spring Security framework
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (io.jsonwebtoken) — JWT creation & validation
- `spring-boot-starter-validation` — request body validation

### 1.2 Create User Entity & Repository

- **`model/User.java`** — JPA entity with fields: `id`, `username`, `email`, `password` (hashed), `role` (e.g. `USER`, `ADMIN`)
- **`repository/UserRepository.java`** — `findByUsername(String username)` query method
- Database table auto-created by JPA (same as `Video`)

---

## Phase 2: Backend — Authentication Endpoints

### 2.1 Create Auth DTOs (`dto/`)

- **`RegisterRequest.java`** — `username`, `email`, `password`
- **`LoginRequest.java`** — `username`, `password`
- **`AuthResponse.java`** — `token`, `username`, `role`

### 2.2 Create AuthController (`controller/AuthController.java`)

- `POST /auth/register` — validate input, hash password with BCrypt, save user, return JWT
- `POST /auth/login` — verify credentials with `AuthenticationManager`, return JWT

---

## Phase 3: Backend — JWT & Security Configuration

### 3.1 JWT Utility Class (`security/JwtUtil.java`)

- `generateToken(UserDetails)` — create signed JWT with username, role, expiration (e.g. 24h)
- `extractUsername(String token)` — parse claims from token
- `isTokenValid(String token, UserDetails)` — check expiration + username match
- Secret key loaded from environment variable (`JWT_SECRET`)

### 3.2 JWT Authentication Filter (`security/JwtAuthFilter.java`)

- Extends `OncePerRequestFilter`
- Extracts `Authorization: Bearer <token>` header
- Validates token and sets `SecurityContext` authentication

### 3.3 UserDetailsService Implementation (`security/CustomUserDetailsService.java`)

- Implements `UserDetailsService`
- Loads user from `UserRepository` by username

### 3.4 Security Config (`config/SecurityConfig.java`)

- Define `SecurityFilterChain` bean:
    - **Public (permitAll):** `GET /videos/**`, `POST /auth/**`
    - **Protected (authenticated):** `POST /videos/**`, `PUT /videos/**`, `DELETE /videos/**`, `POST /api/summary/**`
- Register `JwtAuthFilter` before `UsernamePasswordAuthenticationFilter`
- Disable CSRF (stateless API)
- Set session management to `STATELESS`
- Configure CORS to work alongside Spring Security

---

## Phase 4: Frontend — Auth Service & State

### 4.1 Auth API Utility (`utils/auth.ts`)

- `register(username, email, password)` — `POST /auth/register`
- `login(username, password)` — `POST /auth/login`
- `logout()` — clear stored token
- `getToken()` — retrieve token from `localStorage`
- `getAuthHeaders()` — return `{ Authorization: "Bearer <token>" }` for API calls

### 4.2 Auth State in App

- Add `user` state to `App.tsx` (or a top-level component): `{ username, role, token } | null`
- On app load, check `localStorage` for existing token; validate it's not expired
- Pass `user` and `setUser` down via props (consistent with existing state pattern)

---

## Phase 5: Frontend — Login/Register UI

### 5.1 Auth Pages

- **`pages/Login.tsx`** — login form (username, password), calls `POST /auth/login`
- **`pages/Register.tsx`** — register form (username, email, password), calls `POST /auth/register`
- On success, store token in `localStorage`, update `user` state, redirect to Home

### 5.2 Navbar Updates (`components/Navbar.tsx`)

- Show **Login/Register** links when logged out
- Show **username + Logout button** when logged in

### 5.3 Route Protection

- Add routes for `/login` and `/register` in `App.tsx`
- Hide Add/Edit/Delete UI when not authenticated (conditional rendering)
- Protected API calls (add, edit, delete video) include `Authorization` header

---

## Phase 6: Attach JWT to API Calls

### 6.1 Update Existing API Calls

- Modify `fetch` calls for `POST /videos/add`, `PUT /videos/edit`, `DELETE /videos/{id}`, and `POST /api/summary/{id}` to include `Authorization: Bearer <token>` header
- Handle `401` responses — redirect to login or show message

---

## File Summary

### New Backend Files

| File                                     | Purpose                           |
| ---------------------------------------- | --------------------------------- |
| `model/User.java`                        | User entity                       |
| `repository/UserRepository.java`         | User data access                  |
| `dto/RegisterRequest.java`               | Registration request DTO          |
| `dto/LoginRequest.java`                  | Login request DTO                 |
| `dto/AuthResponse.java`                  | Auth response with JWT            |
| `controller/AuthController.java`         | Register & login endpoints        |
| `security/JwtUtil.java`                  | JWT token utilities               |
| `security/JwtAuthFilter.java`            | Request filter for JWT validation |
| `security/CustomUserDetailsService.java` | Load users from DB                |
| `config/SecurityConfig.java`             | Spring Security configuration     |

### New Frontend Files

| File                 | Purpose                        |
| -------------------- | ------------------------------ |
| `utils/auth.ts`      | Auth API calls + token helpers |
| `pages/Login.tsx`    | Login page                     |
| `pages/Register.tsx` | Register page                  |

### Modified Files

| File              | Change                             |
| ----------------- | ---------------------------------- |
| `pom.xml`         | Add security + JWT dependencies    |
| `App.tsx`         | Add auth state, new routes         |
| `Navbar.tsx`      | Login/logout UI                    |
| `CorsConfig.java` | May merge into SecurityConfig CORS |
| API call sites    | Add Authorization header           |
| `.env`            | Add `JWT_SECRET`                   |

---

## Environment Variables

| Variable         | Location                  | Purpose                            |
| ---------------- | ------------------------- | ---------------------------------- |
| `JWT_SECRET`     | Backend `.env`            | Signing key for JWTs (min 256-bit) |
| `JWT_EXPIRATION` | Backend `.env` (optional) | Token expiry duration              |


## Notes

The token contains **claims** (username, role, expiration) and a signature, but not the secret itself.

A JWT has three parts separated by dots: `header.payload.signature`

- **Header**: algorithm info (`{"alg": "HS256"}`)
- **Payload**: your claims (`{"sub": "john", "role": "USER", "exp": 1234567890}`)
- **Signature**: `HMAC-SHA256(header + payload, JWT_SECRET)`

The signature is a *hash* created using the secret — you can't reverse it to get the secret back. It's like a wax seal: anyone can see the letter's contents, but only the server with the secret can produce (or verify) the seal.

So the payload is actually readable by anyone (it's just base64-encoded, not encrypted). That's why you should never put sensitive data like passwords in a JWT. The purpose of the signature is to prove the token hasn't been tampered with — not to hide the contents.

The token is just a string. It's a single encoded string that looks like gibberish but is actually three base64-encoded parts joined by dots:

`eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huIiwicm9sZSI6IlVTRVIiLCJleHAiOjE3MTIwMDB9.k8Xj3mZv9Rq2Fw5Tn8Yp1Lc6Hd4Bs7Jw0Kv`
`|_______header________||____________________payload_____________________||___________signature___________|`


When you return `ResponseEntity.ok(new AuthResponse(...))`, Spring's built-in Jackson library serializes the Java object into JSON before sending it in the HTTP response.

So this Java code:
`return ResponseEntity.ok(new AuthResponse("eyJhbG...", "john", "USER"));`

Gets automatically converted to this JSON response:

```
{
  "token": "eyJhbG...",
  "username": "john",
  "role": "USER"
}
```
