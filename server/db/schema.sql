-- The complete shape of the database. Safe to run against an empty database,
-- and safe to run twice.
--
-- This file is committed on purpose. Your schema is a fact about your
-- application, not a runtime concern: it should be readable by opening a file
-- rather than by connecting to a server. It is also what lets you move to a
-- hosted database in one command.

CREATE TABLE IF NOT EXISTS sightings (
  id          SERIAL PRIMARY KEY,
  place       TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  spookiness  INTEGER     NOT NULL CHECK (spookiness BETWEEN 1 AND 5),
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The list page always sorts newest first. Without this the database reads
-- every row and sorts it on each request.
CREATE INDEX IF NOT EXISTS sightings_reported_at_idx
  ON sightings (reported_at DESC);

-- Everyone who has signed in or booked. There are no passwords: signing in is
-- a one-time link sent to the email address.
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  email      TEXT        NOT NULL UNIQUE,
  name       TEXT        NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The studio's coaches. A coach can teach at one branch or at both, and is
-- only offered as an instructor at the branches switched on here.
CREATE TABLE IF NOT EXISTS coaches (
  id              SERIAL PRIMARY KEY,
  name            TEXT        NOT NULL,
  specialty       TEXT        NOT NULL DEFAULT '',
  bio             TEXT        NOT NULL DEFAULT '',
  in_angeles      BOOLEAN     NOT NULL DEFAULT false,
  in_san_fernando BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (in_angeles OR in_san_fernando)
);

-- One row per scheduled class session. This is what the admin creates in
-- Manage Schedule and what every visitor's timetable reads, so it has to live
-- here rather than in the server's memory.
--
-- start_time is kept as the label the schedule grid uses ('08:30 AM'); the
-- API only accepts half-hour marks.
CREATE TABLE IF NOT EXISTS classes (
  id           SERIAL PRIMARY KEY,
  title        TEXT        NOT NULL,
  class_date   DATE        NOT NULL,
  start_time   TEXT        NOT NULL,
  duration_min INTEGER     NOT NULL CHECK (duration_min > 0),
  coach_id     INTEGER     NOT NULL REFERENCES coaches (id),
  branch       TEXT        NOT NULL,
  capacity     INTEGER     NOT NULL CHECK (capacity >= 1),
  is_cancelled BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The timetable always loads a week at a time.
CREATE INDEX IF NOT EXISTS classes_class_date_idx
  ON classes (class_date);

-- One row per spot a client has reserved in a class. A booking starts as
-- 'pending' and the admin confirms or rejects it after checking the payment.
--
-- reminder_sent_at is what stops the reminder job emailing someone twice: the
-- job only picks up rows where it is still NULL.
CREATE TABLE IF NOT EXISTS bookings (
  id               SERIAL PRIMARY KEY,
  class_id         INTEGER     NOT NULL REFERENCES classes (id),
  client_name      TEXT        NOT NULL,
  client_email     TEXT        NOT NULL,
  spot             INTEGER     NOT NULL CHECK (spot >= 1),
  reference_id     TEXT        NOT NULL DEFAULT '',
  amount           TEXT        NOT NULL DEFAULT '',
  status           TEXT        NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'confirmed', 'rejected')),
  reminder_sent_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Two people cannot hold the same spot in the same class. A rejected booking
-- gives its spot back. The database enforces this, so two clients who press
-- "Submit" at the same moment cannot both win.
CREATE UNIQUE INDEX IF NOT EXISTS bookings_class_spot_idx
  ON bookings (class_id, spot)
  WHERE status <> 'rejected';

-- ---------------------------------------------------------------------------
-- Changes made after the first release. Each is safe to run again, so running
-- this whole file brings an existing database up to date.
-- ---------------------------------------------------------------------------

-- The client's own profile and email choices, edited from their account page.
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone            TEXT    NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date       DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender           TEXT    NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS address          TEXT    NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_reminders  BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_promotions BOOLEAN NOT NULL DEFAULT false;

-- Clients can cancel their own booking, which frees the spot like a rejection.
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled'));

DROP INDEX IF EXISTS bookings_class_spot_idx;
CREATE UNIQUE INDEX IF NOT EXISTS bookings_class_spot_idx
  ON bookings (class_id, spot)
  WHERE status NOT IN ('rejected', 'cancelled');

-- Packages a client has bought. The package's details are copied in at
-- purchase so later price changes never alter what a client paid for. A
-- purchase is 'pending' until the admin checks the payment; its expiry clock
-- starts when it becomes 'active'.
CREATE TABLE IF NOT EXISTS user_packages (
  id               SERIAL PRIMARY KEY,
  user_email       TEXT        NOT NULL REFERENCES users (email),
  package_id       TEXT        NOT NULL,
  name             TEXT        NOT NULL,
  price            TEXT        NOT NULL,
  reformer_credits INTEGER     NOT NULL DEFAULT 0,
  mat_credits      INTEGER     NOT NULL DEFAULT 0,
  group_credits    INTEGER     NOT NULL DEFAULT 0,
  private_credits  INTEGER     NOT NULL DEFAULT 0,
  clinical_credits INTEGER     NOT NULL DEFAULT 0,
  expiry_days      INTEGER     NOT NULL CHECK (expiry_days > 0),
  reference_id     TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'active', 'rejected')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  activated_at     TIMESTAMPTZ,
  expires_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS user_packages_user_email_idx ON user_packages (user_email);

-- A booking paid for with a package credit records which package and which
-- kind of credit it used. Credits left = credits bought minus the bookings
-- still holding one, so a cancelled or rejected booking gives its credit back.
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_package_id INTEGER REFERENCES user_packages (id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS credit_type TEXT;

-- A private session books a whole empty Reformer class for one client.
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS is_private BOOLEAN NOT NULL DEFAULT false;

-- Proof of payment: a small image the client attaches, kept as a data: URL.
-- Images are shrunk in the browser first, so each is a few hundred kilobytes.
ALTER TABLE bookings      ADD COLUMN IF NOT EXISTS receipt TEXT;
ALTER TABLE user_packages ADD COLUMN IF NOT EXISTS receipt TEXT;

-- Studio settings the admin edits, such as the payment accounts shown at
-- checkout. One JSON value per key.
CREATE TABLE IF NOT EXISTS studio_settings (
  key        TEXT        PRIMARY KEY,
  value      JSONB       NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
