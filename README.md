# Primetrade Notes App

A full-stack TypeScript application with a secure REST API featuring JWT authentication, role-based access control, and notes CRUD — plus a minimal Next.js frontend.

---

## Tech Stack

**Backend** — Node.js + Express.js, MongoDB + Mongoose, JWT, Bcrypt, Zod  
**Frontend** — Next.js (App Router), TypeScript, Tailwind CSS, Axios

---

## Features

- User registration and login with bcrypt password hashing
- JWT authentication via HttpOnly cookies
- Role-based access control (`user` / `admin`)
- Full notes CRUD scoped to the authenticated user
- Admin endpoints to view all users and all notes
- API versioning under `/api/v1`
- Centralized error handling and Zod request validation

---

## Project Structure

```
.
├── backend
│   └── src
│       ├── config/           # DB connection
│       ├── middlewares/      # auth, errorHandler
│       ├── modules/
│       │   ├── users/        # model, controller, validation
│       │   └── notes/        # model, controller, validation
│       ├── routes/           # auth, notes, admin
│       ├── types/            # express.d.ts
│       ├── utils/            # jwt helpers
│       ├── app.ts
│       └── server.ts
│
├── frontend
│   └── app
│       ├── page.tsx          # Landing
│       ├── register/
│       ├── login/
│       ├── dashboard/        # Protected notes CRUD
│       └── admin/            # Admin panel (admin only)
│
└── postman
    └── primetrade.postman_collection.json
```

---

## Getting Started

### Backend

1. Create `.env` in `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

2. Install and run:

```bash
cd backend
npm install
npm run dev
```

Backend runs at `http://localhost:5000`

---

### Frontend

1. Create `.env.local` in `/frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

2. Install and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## API Reference

### Auth — `/api/v1/auth`

| Method | Path        | Description               | Auth     |
|--------|-------------|---------------------------|----------|
| POST   | `/register` | Register a new user       | Public   |
| POST   | `/login`    | Login and set JWT cookie  | Public   |
| GET    | `/me`       | Get current user profile  | Required |
| POST   | `/logout`   | Clear auth cookie         | Required |

### Notes — `/api/v1/notes`

| Method | Path   | Description     | Auth     |
|--------|--------|-----------------|----------|
| POST   | `/`    | Create a note   | Required |
| GET    | `/`    | List your notes | Required |
| GET    | `/:id` | Get note by ID  | Required |
| PUT    | `/:id` | Update a note   | Required |
| DELETE | `/:id` | Delete a note   | Required |

### Admin — `/api/v1/admin`

| Method | Path     | Description        | Auth       |
|--------|----------|--------------------|------------|
| GET    | `/users` | List all users     | Admin only |
| GET    | `/notes` | List all notes     | Admin only |

---

## API Testing

Import `postman/primetrade.postman_collection.json` into Postman.

The collection uses a `baseUrl` variable set to `http://localhost:5000/api/v1`. All endpoints are grouped into **Auth**, **Notes**, and **Admin** folders.

---

## Validation

All requests are validated with Zod. On failure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "path": "email", "message": "Invalid email format" }]
  }
}
```

---

## How Authentication Works

1. User registers or logs in with email and password.
2. Backend issues a JWT signed with `JWT_SECRET` and sets it as an HttpOnly cookie.
3. Protected routes read the cookie, verify the token, and attach `{ id, role }` to `req.user`.
4. `requireRole(["admin"])` guards admin-only routes.
5. Frontend sends requests with `withCredentials: true` so cookies are included automatically.

---

## Status Codes

| Code | Meaning                        |
|------|--------------------------------|
| 200  | OK                             |
| 201  | Created                        |
| 400  | Bad Request (validation error) |
| 401  | Unauthorized                   |
| 403  | Forbidden (insufficient role)  |
| 404  | Not Found                      |
| 409  | Conflict (email already exists)|
| 500  | Internal Server Error          |

---

## Scalability Notes

- **Layered architecture** — config, middlewares, modules, routes, utils are fully separated. New entities (e.g. tasks, products) can be added under `src/modules/{entity}` without touching existing code.
- **API versioning** — all routes under `/api/v1` makes introducing `/api/v2` non-breaking.
- **Stateless JWT auth** — no server-side sessions, so the API can be horizontally scaled behind a load balancer.
- **MongoDB Atlas** — supports vertical and horizontal scaling (sharding). Indexes can be added on `owner` and `createdAt` for high-read performance.
- **Caching** — Redis can be introduced for high-read endpoints with short TTL and write invalidation.
- **Microservices** — the monolith can be split into an auth service and a notes service behind an API gateway if needed.
- **Docker** — backend and frontend can be containerized separately and deployed via any container platform.
