import pg from "pg";            // 1. import the Postgres client
import dotenv from "dotenv";    // 2. loads .env
dotenv.config();                // 3. read .env into process.env

// 4. create a single Client instance using your DATABASE_URL
const pgclient = new pg.Client(process.env.DATABASE_URL);

export default pgclient;        // 5. export it for use in server.js (connect later)
