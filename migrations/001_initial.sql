CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE supporters (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type         CHAR(1)     NOT NULL CHECK (type IN ('p', 'o')),
  designation  VARCHAR(100) NOT NULL,
  first_name   VARCHAR(100),
  last_name    VARCHAR(100),
  organization VARCHAR(200),
  website      VARCHAR(500),
  country      CHAR(3)     NOT NULL,
  language     VARCHAR(10) NOT NULL,
  email        VARCHAR(500) NOT NULL UNIQUE,
  newsletter   BOOLEAN     NOT NULL DEFAULT FALSE,
  verified_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON supporters(country);

CREATE TABLE pending_registrations (
  token      VARCHAR(64)  PRIMARY KEY,
  data       JSONB        NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ  NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);
