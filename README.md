This is the backend for the LifeLink full-stack app. It provides public APIs for hospitals to manage blood requests and for donors to browse requests and record donations.

🏗️ Tech Stack
Node.js + Express
PostgreSQL (via pg)
dotenv, cors, nodemon

🚀 Getting Started

bash
Copy
Edit
# 1. Install dependencies
cd lifelink-backend
npm install

# 2. Create a PostgreSQL database (e.g., `lifelinkdb`)
#    and run the schema
npm run db:init   # runs scripts/init-db.js → src/schema.sql

# 3. Start the server in dev mode
npm run dev
🗂️ Project Structure

graphql
Copy
Edit
lifelink-backend/
├── src/
│   ├── routes/
│   │   ├── hospital.js      # hospital CRUD for /api/requests
│   │   └── donor.js         # donor endpoints under /api/donor
│   ├── db.js                # pg client setup
│   ├── schema.sql           # DB schema (users, requests, donations)
│   └── server.js            # Express app entry point
├── scripts/
│   └── init-db.js           # initializes schema
├── .env                     # DATABASE_URL, FRONTEND_URL, etc.
├── package.json
└── package-lock.json
📡 API Endpoints
The API runs on: http://localhost:4000

Hospital Routes
Base URL: /api/requests

Method	Endpoint	Description
POST	/	Create a new blood request
GET	/	List all requests (most recent)
GET	/:id	Fetch a single request by ID
PUT	/:id	Update any request fields
DELETE	/:id	Delete (cancel) a request

Example: Create Request
bash
Copy
Edit
POST /api/requests
Content-Type: application/json

{
  "hospital_id": 1,
  "blood_type": "O+",
  "units_needed": 5,
  "location": "City Hospital ER",
  "deadline": "2025-07-01",
  "notes": "Urgent, trauma unit"
}
Donor Routes
Base URL: /api/donor

Method	Endpoint	Description
GET	/requests	List all active blood requests
POST	/requests/:id/donate	Donate one unit to request id
GET	/donations	List all donations made by donors

Example: Donate to a Request
bash
Copy
Edit
POST /api/donor/requests/42/donate
Example: View Donations
bash
Copy
Edit
GET /api/donor/donations
