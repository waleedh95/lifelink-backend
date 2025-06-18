# LifeLink Backend (Express + PostgreSQL)

This backend powers the LifeLink application: hospitals manage blood requests, donors browse requests and record single-unit donations, and users sign up / log in to get a JWT for protected actions.

---

## 🏗️ Tech Stack

- **Node.js + Express**
- **PostgreSQL** (via `pg`)
- **dotenv**, **cors**, **nodemon**, **bcrypt**, **jsonwebtoken**

---

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   cd lifelink-backend
   npm install
   Create a PostgreSQL database
   ```
   createdb lifelinkdb
   Configure environment
   Create a .env file in the project root:

DATABASE_URL=postgres://<user>:<pass>@<host>:<port>/lifelinkdb
ACCESS_TOKEN_SECRET=<your_jwt_secret>
FRONTEND_URL=http://localhost:5173
Initialize the database schema

npm run db:init # runs scripts/init-db.js → src/schema.sql
Start the development server

npm run dev
🗂️ Project Structure
lifelink-backend/
├── src/
│ ├── routes/
│ │ ├── auth.js # POST /api/auth/signup, /api/auth/login
│ │ ├── hospital.js # CRUD for /api/requests
│ │ └── donor.js # donor actions under /api/donor
│ ├── middleware/
│ │ └── auth.js # JWT verification & role checks
│ ├── db.js # PostgreSQL client setup
│ ├── schema.sql # Tables: users, requests, donations
│ └── server.js # Express application entry point
├── scripts/
│ └── init-db.js # Applies schema.sql
├── .env # Environment variables
├── package.json
└── package-lock.json
📡 API Endpoints
The API runs on http://localhost:4000

🔐 Auth Routes
Base URL: /api/auth

Method Endpoint Description
POST /signup Register a new user
POST /login Log in and receive JWT

📦 Request Routes
Base URL: /api/requests

Method Endpoint Description
POST / Create a new blood request
GET / List all requests (most recent first)
GET /:id Fetch one request by ID
PUT /:id Update any request fields
DELETE /:id Cancel/delete a request

🩸 Donor Routes
Base URL: /api/donor

Method Endpoint Description
GET /requests List all active blood requests
POST /requests/:id/donate Donate one unit to the request with given id
GET /donations List all donations made by the logged-in donor
