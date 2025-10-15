# Rephome – MERN Application

A complete MERN stack application for doorstep phone repair bookings with JWT authentication, user-owned bookings, and a React client.

## Stack
- Server: Node.js, Express, Mongoose (MongoDB)
- Client: React 18 + Vite + React Router
- Auth: JSON Web Tokens (JWT)

## Repository Structure
```
.
├─ server/          # Express API (MongoDB, JWT auth, bookings)
├─ client/          # React app (auth, bookings UI)
└─ (no root package.json)
```

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB running locally at `mongodb://127.0.0.1:27017`

## 1) Setup
1. Create environment file at `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/rephome
JWT_SECRET=replace_with_long_random_string
CLIENT_URL=http://localhost:5173
```
2. Install dependencies in each app folder:
```
cd server && npm install
cd ../client && npm install
```

## 2) Run (Dev)
Run server and client in separate terminals:
```
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```
- Client: http://localhost:5173
- API: http://localhost:5000
- Health check: `GET /api/health` → `{ status: "ok" }`

## 3) API Overview
Base URL: `http://localhost:5000/api`

Auth
- POST `/auth/register` — body: `{ name, email, password }`
- POST `/auth/login` — body: `{ email, password }`
- GET `/auth/me` — header: `Authorization: Bearer <token>`

Bookings (requires Bearer token)
- GET `/bookings` — list current user bookings
- POST `/bookings` — create booking
  - body: `{ name, phone, email, address, deviceModel, issue, description?, preferredDate, preferredTime }`
- GET `/bookings/:id` — get own booking
- PUT `/bookings/:id` — update own booking
- DELETE `/bookings/:id` — cancel own booking (sets `status=cancelled`)

Admin (requires role=admin)
- GET `/bookings/admin/all`
- PATCH `/bookings/admin/:id/status` — body: `{ status }` where status ∈ `pending|confirmed|in_progress|completed|cancelled`

## 4) Client Overview
- Auth flow stored in localStorage (token + user)
- Pages:
  - Login (`/login`) and Register (`/register`)
  - Dashboard (`/`) with quick links
  - My Bookings (`/bookings`) — protected route
- Minimal demo “Create booking” button to verify end-to-end API connectivity

## 5) Development Notes
- CORS configured to allow `CLIENT_URL`
- Legacy static site removed in favor of the React client
- Backend lives in `server/`

## 6) Useful Commands
- Server: `cd server && npm run dev`
- Client: `cd client && npm run dev`

## 7) Production Considerations
- Use strong `JWT_SECRET` and environment-specific `CLIENT_URL`
- Serve the client via a CDN or from a production host (e.g., Vercel/Netlify)
- Add rate limiting, request validation (e.g., zod/joi), logging (morgan/pino)
- Configure HTTPS and secure cookies if moving to cookie-based auth
- Set up CI/CD and environment secrets for deployments

## 8) Troubleshooting
- If MongoDB connection fails, ensure the service is running and the URI is correct
- If CORS errors appear in the client, verify `CLIENT_URL` in `server/.env`
- On Windows PowerShell, run scripts from the repository root

---
This README covers end-to-end setup, run, and usage for the MERN app. For UI/UX enhancements or migrating legacy static pages into React components, open an issue or request the next task.