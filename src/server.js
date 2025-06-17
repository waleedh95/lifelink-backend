// src/server.js
import express from "express";
import dotenv from "dotenv";
import pgclient from "./db.js";
import cors from 'cors';
import hospitalRoutes from './routes/hospital.js';

// ——— AUTH0 DISABLED ———
// import expressOIDC from "express-openid-connect"; // Auth0 SDK
// const { auth, requiresAuth } = expressOIDC;

dotenv.config();

// connect to postgres
pgclient.connect()
  .then(() => console.log("✅ Connected to Postgres"))
  .catch(err => console.error("❌ Postgres connection error:", err));

const app = express();
app.use(express.json());

// ——— STUB OUT requiresAuth ———
const requiresAuth = () => (_req, _res, next) => next();

// ——— COMMENT OUT ACTUAL AUTH0 MIDDLEWARE ———
// app.use(
//   auth({
//     authRequired: false,
//     auth0Logout:  true,
//     secret:       process.env.AUTH0_SECRET,
//     baseURL:      process.env.AUTH0_BASE_URL,
//     clientID:     process.env.AUTH0_CLIENT_ID,
//     issuerBaseURL:process.env.AUTH0_ISSUER_BASE_URL
//   })
// );

const frontend = process.env.FRONTEND_URL;
app.use(
  cors({
    origin: frontend,
    credentials: true,
  })
);

// public route
app.get("/", (req, res) => {
  res.send('🩸 Welcome to LifeLink API. (Auth0 disabled for testing)');
});

// ——— COMMENT OUT PROTECTED EXAMPLES ———
// app.get("/profile", requiresAuth(), (req, res) => {
//   res.json(req.oidc.user);
// });

// app.get("/api/requests", requiresAuth(), async (req, res) => { /*…*/ });

app.set('trust proxy', 1);

// now mount your hospital CRUD router (no more requiresAuth)
app.use(
  '/api/requests',
  hospitalRoutes
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🩸 LifeLink backend listening on ${PORT}`)
);
