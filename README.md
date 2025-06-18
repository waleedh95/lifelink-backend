LifeLink Backend
This backend powers the LifeLink application: hospitals can create, view, edit and cancel blood requests, while donors browse active requests and record one-unit donations.

🏗️ Tech Stack
• Node.js + Express  
• PostgreSQL (via pg)  
• dotenv, cors, nodemon

👥 User Roles & Capabilities
• Hospital  
 – Create a new blood request (POST /api/requests)  
 – List all their requests (GET /api/requests)  
 – View one request’s details (GET /api/requests/:id)  
 – Edit any request (PUT /api/requests/:id)  
 – Cancel/Delete a request (DELETE /api/requests/:id)

• Donor  
 – Browse active blood requests (GET /api/donor/requests)  
 – Donate one unit to a request (POST /api/donor/requests/:id/donate)  
 – View donation history (GET /api/donor/donations)

🚀 Getting Started

# 1. Install dependencies

cd lifelink-backend  
npm install

# 2. Start the development server

npm run dev
