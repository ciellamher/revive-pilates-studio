-- The studio's coaches, so a fresh database has someone to teach the demo
-- schedule. Insert-only: a coach who already exists (by name) is skipped, so
-- this is safe to run against any database, including the live one.
--
--   npm run db:seed

INSERT INTO coaches (name, specialty, in_angeles, in_san_fernando)
SELECT v.name, v.specialty, v.in_angeles, v.in_san_fernando
FROM (VALUES
  ('Bea',     'Reformer, Mat Pilates', true,  false),
  ('Chelsea', 'Reformer, Mat Pilates', true,  true),
  ('Van',     'Reformer',              true,  true),
  ('Tet',     'Mat Pilates, Barre',    true,  true),
  ('Abby',    'Reformer, Mat Pilates', false, true)
) AS v (name, specialty, in_angeles, in_san_fernando)
WHERE NOT EXISTS (SELECT 1 FROM coaches c WHERE c.name = v.name);
