-- src/schema.sql
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  auth0_id   TEXT   UNIQUE NOT NULL,       -- from req.oidc.user.sub
  email      TEXT   UNIQUE NOT NULL,
  name       TEXT   NOT NULL,
  role       TEXT   NOT NULL  CHECK (role IN ('hospital','donor')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS requests (
  id               SERIAL PRIMARY KEY,
  hospital_id      INTEGER NOT NULL REFERENCES users(id),
  blood_type       TEXT    NOT NULL,
  units_needed     INTEGER NOT NULL,
  units_fulfilled  INTEGER NOT NULL DEFAULT 0,
  location         TEXT    NOT NULL,
  deadline         DATE,
  notes            TEXT,
  status           TEXT    NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','Fulfilled','Cancelled')),
  created_at       TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donations (
  id           SERIAL PRIMARY KEY,
  donor_id     INTEGER NOT NULL REFERENCES users(id),
  request_id   INTEGER NOT NULL REFERENCES requests(id),
  units        INTEGER NOT NULL,
  status       TEXT    NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Completed','Cancelled')),
  donated_at   TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);



