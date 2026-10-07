-- Demo timetable for the rest of October 2026, so the schedule is never empty.
--
-- Insert-only: it never truncates or updates. A slot that already has a class
-- at the same branch, date and time is skipped, so running it twice is safe.
-- Coaches are looked up by name, so it works on any database seeded with them.
--
--   npm run db:october
--
-- The week repeats from Oct 8 to Oct 31. isodow: 1 = Monday ... 7 = Sunday.

INSERT INTO classes
  (title, class_date, start_time, duration_min, coach_id, branch, capacity, allow_private)
SELECT
  w.title,
  d.day,
  w.start_time,
  60,
  c.id,
  w.branch,
  CASE
    WHEN w.title = 'Reformer Flow'   THEN 4
    WHEN w.title = 'Private Session' THEN 1
    ELSE 10
  END,
  w.title IN ('Reformer Flow', 'Private Session')
FROM generate_series(DATE '2026-10-08', DATE '2026-10-31', interval '1 day') AS d(day)
JOIN (VALUES
  -- Angeles: Bea opens weekdays, Chelsea runs the evenings, Tet teaches mat and barre.
  (1, 'Angeles', '07:00 AM', 'Reformer Flow',   'Bea'),
  (1, 'Angeles', '08:00 AM', 'Reformer Flow',   'Bea'),
  (1, 'Angeles', '09:00 AM', 'Reformer Flow',   'Bea'),
  (1, 'Angeles', '12:00 PM', 'Mat Pilates',     'Chelsea'),
  (1, 'Angeles', '05:00 PM', 'Reformer Flow',   'Chelsea'),
  (1, 'Angeles', '06:00 PM', 'Reformer Flow',   'Chelsea'),
  (1, 'Angeles', '07:00 PM', 'Barre',           'Tet'),

  (2, 'Angeles', '07:00 AM', 'Reformer Flow',   'Bea'),
  (2, 'Angeles', '08:00 AM', 'Reformer Flow',   'Bea'),
  (2, 'Angeles', '10:00 AM', 'Private Session', 'Bea'),
  (2, 'Angeles', '05:00 PM', 'Mat Pilates',     'Chelsea'),
  (2, 'Angeles', '06:00 PM', 'Reformer Flow',   'Chelsea'),
  (2, 'Angeles', '07:00 PM', 'Reformer Flow',   'Chelsea'),

  (3, 'Angeles', '07:00 AM', 'Reformer Flow',   'Bea'),
  (3, 'Angeles', '08:00 AM', 'Reformer Flow',   'Bea'),
  (3, 'Angeles', '09:00 AM', 'Reformer Flow',   'Bea'),
  (3, 'Angeles', '12:00 PM', 'Mat Pilates',     'Chelsea'),
  (3, 'Angeles', '05:00 PM', 'Reformer Flow',   'Chelsea'),
  (3, 'Angeles', '06:00 PM', 'Reformer Flow',   'Chelsea'),
  (3, 'Angeles', '07:00 PM', 'Mat Pilates',     'Tet'),

  (4, 'Angeles', '07:00 AM', 'Reformer Flow',   'Bea'),
  (4, 'Angeles', '08:00 AM', 'Reformer Flow',   'Bea'),
  (4, 'Angeles', '10:00 AM', 'Private Session', 'Bea'),
  (4, 'Angeles', '05:00 PM', 'Mat Pilates',     'Chelsea'),
  (4, 'Angeles', '06:00 PM', 'Reformer Flow',   'Chelsea'),
  (4, 'Angeles', '07:00 PM', 'Reformer Flow',   'Chelsea'),

  (5, 'Angeles', '07:00 AM', 'Reformer Flow',   'Van'),
  (5, 'Angeles', '08:00 AM', 'Reformer Flow',   'Van'),
  (5, 'Angeles', '09:00 AM', 'Reformer Flow',   'Van'),
  (5, 'Angeles', '05:00 PM', 'Reformer Flow',   'Chelsea'),
  (5, 'Angeles', '06:00 PM', 'Barre',           'Chelsea'),

  (6, 'Angeles', '08:00 AM', 'Reformer Flow',   'Chelsea'),
  (6, 'Angeles', '09:00 AM', 'Reformer Flow',   'Chelsea'),
  (6, 'Angeles', '10:30 AM', 'Mat Pilates',     'Tet'),
  (6, 'Angeles', '02:00 PM', 'Reformer Flow',   'Bea'),
  (6, 'Angeles', '03:00 PM', 'Reformer Flow',   'Bea'),

  (7, 'Angeles', '09:00 AM', 'Reformer Flow',   'Bea'),
  (7, 'Angeles', '10:00 AM', 'Reformer Flow',   'Bea'),
  (7, 'Angeles', '04:00 PM', 'Reformer Flow',   'Bea'),

  -- San Fernando: Van takes weekday mornings, Abby the afternoons and evenings.
  (1, 'San Fernando', '07:00 AM', 'Reformer Flow',   'Van'),
  (1, 'San Fernando', '08:00 AM', 'Reformer Flow',   'Van'),
  (1, 'San Fernando', '09:00 AM', 'Reformer Flow',   'Van'),
  (1, 'San Fernando', '05:00 PM', 'Reformer Flow',   'Abby'),
  (1, 'San Fernando', '06:00 PM', 'Reformer Flow',   'Abby'),
  (1, 'San Fernando', '07:00 PM', 'Mat Pilates',     'Abby'),

  (2, 'San Fernando', '08:00 AM', 'Reformer Flow',   'Abby'),
  (2, 'San Fernando', '09:00 AM', 'Reformer Flow',   'Abby'),
  (2, 'San Fernando', '05:30 PM', 'Mat Pilates',     'Tet'),
  (2, 'San Fernando', '06:00 PM', 'Reformer Flow',   'Van'),
  (2, 'San Fernando', '07:00 PM', 'Reformer Flow',   'Van'),

  (3, 'San Fernando', '07:00 AM', 'Reformer Flow',   'Van'),
  (3, 'San Fernando', '08:00 AM', 'Reformer Flow',   'Van'),
  (3, 'San Fernando', '09:00 AM', 'Reformer Flow',   'Van'),
  (3, 'San Fernando', '05:00 PM', 'Reformer Flow',   'Abby'),
  (3, 'San Fernando', '06:00 PM', 'Reformer Flow',   'Abby'),
  (3, 'San Fernando', '07:00 PM', 'Barre',           'Abby'),

  (4, 'San Fernando', '08:00 AM', 'Reformer Flow',   'Abby'),
  (4, 'San Fernando', '09:00 AM', 'Reformer Flow',   'Abby'),
  (4, 'San Fernando', '11:00 AM', 'Private Session', 'Abby'),
  (4, 'San Fernando', '05:30 PM', 'Mat Pilates',     'Tet'),
  (4, 'San Fernando', '06:00 PM', 'Reformer Flow',   'Van'),
  (4, 'San Fernando', '07:00 PM', 'Reformer Flow',   'Van'),

  (5, 'San Fernando', '08:00 AM', 'Reformer Flow',   'Abby'),
  (5, 'San Fernando', '09:00 AM', 'Reformer Flow',   'Abby'),
  (5, 'San Fernando', '10:00 AM', 'Reformer Flow',   'Abby'),
  (5, 'San Fernando', '04:00 PM', 'Reformer Flow',   'Abby'),
  (5, 'San Fernando', '05:30 PM', 'Mat Pilates',     'Tet'),

  (6, 'San Fernando', '08:00 AM', 'Reformer Flow',   'Abby'),
  (6, 'San Fernando', '09:00 AM', 'Reformer Flow',   'Abby'),
  (6, 'San Fernando', '10:00 AM', 'Reformer Flow',   'Abby'),
  (6, 'San Fernando', '03:00 PM', 'Reformer Flow',   'Van'),
  (6, 'San Fernando', '04:00 PM', 'Reformer Flow',   'Van'),

  (7, 'San Fernando', '09:00 AM', 'Reformer Flow',   'Abby'),
  (7, 'San Fernando', '10:00 AM', 'Mat Pilates',     'Abby')
) AS w (isodow, branch, start_time, title, coach)
  ON w.isodow = EXTRACT(ISODOW FROM d.day)
JOIN coaches c ON c.name = w.coach
WHERE NOT EXISTS (
  SELECT 1 FROM classes x
  WHERE x.class_date = d.day
    AND x.start_time = w.start_time
    AND x.branch     = w.branch
);
