import express from "express";
import dotenv from "dotenv";
import pgclient from "./db.js";
import cors from "cors";

import hospitalRoutes from "./routes/hospital.js";
import donorRoutes    from "./routes/donor.js";

dotenv.config();

// 1) Connect to Postgres
pgclient
  .connect()
  .then(() => console.log("✅ Connected to Postgres"))
  .catch(err => console.error("❌ Postgres connection error:", err));

const app = express();

// 2) JSON + CORS
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", 
    credentials: true,
  })
);

// 3) Health-check
app.get("/", (_req, res) => {
  res.send("🩸 LifeLink API (no auth)");
});

// 4) Mount hospital‐side CRUD at /api/requests
app.use("/api/requests", hospitalRoutes);

// 5) Mount donor‐side CRUD at /api/donor
app.use("/api/donor", donorRoutes);

// 6) Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🩸 LifeLink backend listening on ${PORT}`)
);