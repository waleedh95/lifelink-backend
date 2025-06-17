import express from "express";
import dotenv from "dotenv";
import pgclient from "./db.js";

import expressOIDC from "express-openid-connect"; // ← import the default export
const { auth, requiresAuth } = expressOIDC;       // ← destructure what you need

dotenv.config();

// connect to postgres
pgclient.connect()
  .then(() => console.log("✅ Connected to Postgres"))
  .catch(err => console.error("❌ Postgres connection error:", err));

const app = express();
app.use(express.json());

// Auth0 setup
app.use(
  auth({
    authRequired: false,
    auth0Logout:  true,
    secret:       process.env.AUTH0_SECRET,
    baseURL:      process.env.AUTH0_BASE_URL,
    clientID:     process.env.AUTH0_CLIENT_ID,
    issuerBaseURL:process.env.AUTH0_ISSUER_BASE_URL
  })
);

// public route
app.get("/", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.send(`👋 Hello ${req.oidc.user.name}`);
  }
  res.send('🩸 Welcome to LifeLink API. <a href="/login">Log in</a>.');
});

// protected profile
app.get("/profile", requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});

// example protected API
app.get("/api/requests", requiresAuth(), async (req, res) => {
  try {
    const result = await pgclient.query("SELECT * FROM requests");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.set('trust proxy', 1); // if you're behind any proxy (e.g. in production or certain dev setups)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🩸 LifeLink backend listening on ${PORT}`)
);
