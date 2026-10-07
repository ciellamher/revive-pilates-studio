-- Demo clients, package purchases and bookings, so the admin dashboard and
-- client directory have something to show.
--
-- Every demo client has an @example.com address, which can never receive
-- mail, and email reminders switched off, so no job ever emails them.
-- Re-running replaces only these demo rows; nothing else is touched.
--
--   npm run db:demo-clients
--
-- Remove them all: run only the three DELETE statements below.

BEGIN;

DELETE FROM bookings      WHERE client_email LIKE '%@example.com';
DELETE FROM user_packages WHERE user_email   LIKE '%@example.com';
DELETE FROM users         WHERE email        LIKE '%@example.com';

INSERT INTO users (email, name, phone, address, email_reminders, created_at) VALUES
  ('andrea.santos@example.com', 'Andrea Santos', '+63 917 555 1000', 'Angeles, Pampanga', false, TIMESTAMPTZ '2026-09-14 10:00+08'),
  ('bianca.reyes@example.com', 'Bianca Reyes', '+63 917 555 1037', 'Angeles, Pampanga', false, TIMESTAMPTZ '2026-09-15 10:00+08'),
  ('camille.dizon@example.com', 'Camille Dizon', '+63 917 555 1074', 'San Fernando, Pampanga', false, TIMESTAMPTZ '2026-09-16 10:00+08'),
  ('danica.manalo@example.com', 'Danica Manalo', '+63 917 555 1111', 'Angeles, Pampanga', false, TIMESTAMPTZ '2026-09-17 10:00+08'),
  ('erika.lansangan@example.com', 'Erika Lansangan', '+63 917 555 1148', 'San Fernando, Pampanga', false, TIMESTAMPTZ '2026-09-18 10:00+08'),
  ('francine.tolentino@example.com', 'Francine Tolentino', '+63 917 555 1185', 'Angeles, Pampanga', false, TIMESTAMPTZ '2026-09-19 10:00+08'),
  ('gabrielle.cruz@example.com', 'Gabrielle Cruz', '+63 917 555 1222', 'San Fernando, Pampanga', false, TIMESTAMPTZ '2026-09-20 10:00+08'),
  ('hannah.yumul@example.com', 'Hannah Yumul', '+63 917 555 1259', 'Angeles, Pampanga', false, TIMESTAMPTZ '2026-09-21 10:00+08'),
  ('isabel.pineda@example.com', 'Isabel Pineda', '+63 917 555 1296', 'San Fernando, Pampanga', false, TIMESTAMPTZ '2026-09-22 10:00+08'),
  ('janine.garcia@example.com', 'Janine Garcia', '+63 917 555 1333', 'Angeles, Pampanga', false, TIMESTAMPTZ '2026-09-23 10:00+08'),
  ('katrina.mercado@example.com', 'Katrina Mercado', '+63 917 555 1370', 'San Fernando, Pampanga', false, TIMESTAMPTZ '2026-09-24 10:00+08'),
  ('lara.bautista@example.com', 'Lara Bautista', '+63 917 555 1407', 'Angeles, Pampanga', false, TIMESTAMPTZ '2026-09-25 10:00+08'),
  ('mika.navarro@example.com', 'Mika Navarro', '+63 917 555 1444', 'San Fernando, Pampanga', false, TIMESTAMPTZ '2026-09-14 10:00+08'),
  ('nicole.aquino@example.com', 'Nicole Aquino', '+63 917 555 1481', 'Angeles, Pampanga', false, TIMESTAMPTZ '2026-09-15 10:00+08'),
  ('patricia.ocampo@example.com', 'Patricia Ocampo', '+63 917 555 1518', 'San Fernando, Pampanga', false, TIMESTAMPTZ '2026-09-16 10:00+08'),
  ('rafael.david@example.com', 'Rafael David', '+63 917 555 1555', 'Angeles, Pampanga', false, TIMESTAMPTZ '2026-09-17 10:00+08'),
  ('sofia.villanueva@example.com', 'Sofia Villanueva', '+63 917 555 1592', 'Angeles, Pampanga', false, TIMESTAMPTZ '2026-09-18 10:00+08'),
  ('trisha.castro@example.com', 'Trisha Castro', '+63 917 555 1629', 'San Fernando, Pampanga', false, TIMESTAMPTZ '2026-09-19 10:00+08');

INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('andrea.santos@example.com', 'reformer-10', 'Reformer Group Class: 10 Reformer Group Sessions', '₱10,000', 10, 0, 0, 0, 0, 60, 'first-booking', 'GCASH-884271', 'active', TIMESTAMPTZ '2026-09-22 09:00+08', TIMESTAMPTZ '2026-09-23 11:00+08', TIMESTAMPTZ '2026-11-22 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('bianca.reyes@example.com', 'intro-boost', 'Intro Boost', '₱7,380', 0, 0, 0, 5, 0, 30, 'first-booking', 'GCASH-888555', 'active', TIMESTAMPTZ '2026-09-25 09:00+08', TIMESTAMPTZ '2026-09-26 11:00+08', TIMESTAMPTZ '2026-10-26 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('camille.dizon@example.com', 'reformer-5', 'Reformer Group Class: 5 Reformer Group Sessions', '₱5,250', 5, 0, 0, 0, 0, 30, 'first-booking', 'GCASH-892852', 'active', TIMESTAMPTZ '2026-09-28 09:00+08', TIMESTAMPTZ '2026-09-29 11:00+08', TIMESTAMPTZ '2026-10-29 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('camille.dizon@example.com', 'mat-5', 'Mat/Barre Group Class: 5 Mat/Barre Group Sessions', '₱2,875', 0, 5, 0, 0, 0, 60, 'purchase', 'GCASH-897149', 'active', TIMESTAMPTZ '2026-10-03 09:00+08', TIMESTAMPTZ '2026-10-04 11:00+08', TIMESTAMPTZ '2026-12-03 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('danica.manalo@example.com', 'mat-10', 'Mat/Barre Group Class: 10 Mat/Barre Group Sessions', '₱5,500', 0, 10, 0, 0, 0, 120, 'purchase', 'GCASH-901459', 'active', TIMESTAMPTZ '2026-10-01 09:00+08', TIMESTAMPTZ '2026-10-02 11:00+08', TIMESTAMPTZ '2027-01-30 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('erika.lansangan@example.com', 'reformer-10', 'Reformer Group Class: 10 Reformer Group Sessions', '₱10,000', 10, 0, 0, 0, 0, 60, 'first-booking', 'GCASH-905782', 'active', TIMESTAMPTZ '2026-10-04 09:00+08', TIMESTAMPTZ '2026-10-05 11:00+08', TIMESTAMPTZ '2026-12-04 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('francine.tolentino@example.com', 'revive-starter', 'Revive Starter', '₱5,220', 0, 0, 0, 3, 0, 30, 'first-booking', 'GCASH-910118', 'active', TIMESTAMPTZ '2026-09-23 09:00+08', TIMESTAMPTZ '2026-09-24 11:00+08', TIMESTAMPTZ '2026-10-24 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('gabrielle.cruz@example.com', 'trial-two', 'Trial Two', '₱2,880', 0, 0, 4, 0, 0, 30, 'first-booking', 'GCASH-914467', 'active', TIMESTAMPTZ '2026-09-26 09:00+08', TIMESTAMPTZ '2026-09-27 11:00+08', TIMESTAMPTZ '2026-10-27 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('hannah.yumul@example.com', 'private-intro', 'Private Pilates: Intro Class', '₱6,000', 0, 0, 0, 0, 3, 30, 'purchase', 'GCASH-918829', 'active', TIMESTAMPTZ '2026-09-29 09:00+08', TIMESTAMPTZ '2026-09-30 11:00+08', TIMESTAMPTZ '2026-10-30 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('isabel.pineda@example.com', 'reformer-5', 'Reformer Group Class: 5 Reformer Group Sessions', '₱5,250', 5, 0, 0, 0, 0, 30, 'first-booking', 'GCASH-923204', 'pending', TIMESTAMPTZ '2026-10-02 09:00+08', NULL, NULL);
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('janine.garcia@example.com', 'reformer-10', 'Reformer Group Class: 10 Reformer Group Sessions', '₱10,000', 10, 0, 0, 0, 0, 60, 'first-booking', 'GCASH-927592', 'active', TIMESTAMPTZ '2026-10-05 09:00+08', TIMESTAMPTZ '2026-10-06 11:00+08', TIMESTAMPTZ '2026-12-05 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('janine.garcia@example.com', 'mat-5', 'Mat/Barre Group Class: 5 Mat/Barre Group Sessions', '₱2,875', 0, 5, 0, 0, 0, 60, 'purchase', 'GCASH-931980', 'active', TIMESTAMPTZ '2026-09-26 09:00+08', TIMESTAMPTZ '2026-09-27 11:00+08', TIMESTAMPTZ '2026-11-26 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('katrina.mercado@example.com', 'intro-boost', 'Intro Boost', '₱7,380', 0, 0, 0, 5, 0, 30, 'first-booking', 'GCASH-936381', 'pending', TIMESTAMPTZ '2026-09-24 09:00+08', NULL, NULL);
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('lara.bautista@example.com', 'reformer-1', 'Reformer Group Class: Single Session', '₱1,100', 1, 0, 0, 0, 0, 7, 'purchase', 'GCASH-940795', 'pending', TIMESTAMPTZ '2026-09-27 09:00+08', NULL, NULL);
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('mika.navarro@example.com', 'mat-10', 'Mat/Barre Group Class: 10 Mat/Barre Group Sessions', '₱5,500', 0, 10, 0, 0, 0, 120, 'purchase', 'GCASH-945222', 'active', TIMESTAMPTZ '2026-09-30 09:00+08', TIMESTAMPTZ '2026-10-01 11:00+08', TIMESTAMPTZ '2027-01-29 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('nicole.aquino@example.com', 'reformer-5', 'Reformer Group Class: 5 Reformer Group Sessions', '₱5,250', 5, 0, 0, 0, 0, 30, 'first-booking', 'GCASH-949662', 'active', TIMESTAMPTZ '2026-10-03 09:00+08', TIMESTAMPTZ '2026-10-04 11:00+08', TIMESTAMPTZ '2026-11-03 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('patricia.ocampo@example.com', 'revive-starter', 'Revive Starter', '₱5,220', 0, 0, 0, 3, 0, 30, 'first-booking', 'GCASH-954115', 'active', TIMESTAMPTZ '2026-09-22 09:00+08', TIMESTAMPTZ '2026-09-23 11:00+08', TIMESTAMPTZ '2026-10-23 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('rafael.david@example.com', 'reformer-10', 'Reformer Group Class: 10 Reformer Group Sessions', '₱10,000', 10, 0, 0, 0, 0, 60, 'first-booking', 'GCASH-958581', 'active', TIMESTAMPTZ '2026-09-25 09:00+08', TIMESTAMPTZ '2026-09-26 11:00+08', TIMESTAMPTZ '2026-11-25 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('sofia.villanueva@example.com', 'trial-two', 'Trial Two', '₱2,880', 0, 0, 4, 0, 0, 30, 'first-booking', 'GCASH-963060', 'active', TIMESTAMPTZ '2026-09-28 09:00+08', TIMESTAMPTZ '2026-09-29 11:00+08', TIMESTAMPTZ '2026-10-29 11:00+08');
INSERT INTO user_packages (user_email, package_id, name, price, reformer_credits, mat_credits, group_credits, any_credits, private_credits, expiry_days, starts_on, reference_id, status, created_at, activated_at, expires_at)
  VALUES ('trisha.castro@example.com', 'reformer-5', 'Reformer Group Class: 5 Reformer Group Sessions', '₱5,250', 5, 0, 0, 0, 0, 30, 'first-booking', 'GCASH-967552', 'rejected', TIMESTAMPTZ '2026-10-01 09:00+08', NULL, NULL);

-- Bookings paid with those packages. Each takes the lowest free spot, and
-- is skipped if the class is gone or already full.
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Rafael David', 'rafael.david@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-958581'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-09-28' AND c.start_time = '03:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Andrea Santos', 'andrea.santos@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-884271'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-09-30' AND c.start_time = '07:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Francine Tolentino', 'francine.tolentino@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'any', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-910118'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-09-30' AND c.start_time = '08:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Rafael David', 'rafael.david@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-958581'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-09-30' AND c.start_time = '08:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Bianca Reyes', 'bianca.reyes@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'any', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-888555'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-01' AND c.start_time = '06:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Andrea Santos', 'andrea.santos@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-884271'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-01' AND c.start_time = '07:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Andrea Santos', 'andrea.santos@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-884271'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-02' AND c.start_time = '09:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Sofia Villanueva', 'sofia.villanueva@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'group', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-963060'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-03' AND c.start_time = '04:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Danica Manalo', 'danica.manalo@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-901459'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-03' AND c.start_time = '10:30 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Camille Dizon', 'camille.dizon@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-897149'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-08' AND c.start_time = '05:30 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Rafael David', 'rafael.david@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-958581'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-08' AND c.start_time = '08:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Janine Garcia', 'janine.garcia@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-927592'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-08' AND c.start_time = '11:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Camille Dizon', 'camille.dizon@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-892852'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-09' AND c.start_time = '04:00 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Erika Lansangan', 'erika.lansangan@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-905782'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-10' AND c.start_time = '09:00 AM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Francine Tolentino', 'francine.tolentino@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'any', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-910118'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-11' AND c.start_time = '04:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Sofia Villanueva', 'sofia.villanueva@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'group', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-963060'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-12' AND c.start_time = '05:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Erika Lansangan', 'erika.lansangan@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-905782'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-12' AND c.start_time = '10:00 AM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Danica Manalo', 'danica.manalo@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-901459'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-12' AND c.start_time = '12:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Mika Navarro', 'mika.navarro@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-945222'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-13' AND c.start_time = '05:30 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Gabrielle Cruz', 'gabrielle.cruz@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'group', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-914467'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-13' AND c.start_time = '09:00 AM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Mika Navarro', 'mika.navarro@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-945222'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-14' AND c.start_time = '07:00 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Erika Lansangan', 'erika.lansangan@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-905782'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-14' AND c.start_time = '10:00 AM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Danica Manalo', 'danica.manalo@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-901459'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-14' AND c.start_time = '12:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Janine Garcia', 'janine.garcia@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-927592'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-15' AND c.start_time = '08:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Nicole Aquino', 'nicole.aquino@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-949662'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-16' AND c.start_time = '09:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Patricia Ocampo', 'patricia.ocampo@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'any', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-954115'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-16' AND c.start_time = '09:00 AM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Rafael David', 'rafael.david@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-958581'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-17' AND c.start_time = '02:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Mika Navarro', 'mika.navarro@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-945222'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-18' AND c.start_time = '10:00 AM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Andrea Santos', 'andrea.santos@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-884271'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-19' AND c.start_time = '06:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Janine Garcia', 'janine.garcia@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-927592'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-19' AND c.start_time = '06:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Camille Dizon', 'camille.dizon@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-897149'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-19' AND c.start_time = '07:00 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Mika Navarro', 'mika.navarro@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-945222'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-19' AND c.start_time = '07:00 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Gabrielle Cruz', 'gabrielle.cruz@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'group', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-914467'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-20' AND c.start_time = '08:00 AM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Hannah Yumul', 'hannah.yumul@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'private', true, 'solo', now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-918829'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-20' AND c.start_time = '10:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Andrea Santos', 'andrea.santos@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-884271'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-21' AND c.start_time = '08:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Bianca Reyes', 'bianca.reyes@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'any', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-888555'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-21' AND c.start_time = '08:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Janine Garcia', 'janine.garcia@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-931980'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-22' AND c.start_time = '05:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Mika Navarro', 'mika.navarro@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-945222'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-22' AND c.start_time = '05:30 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Erika Lansangan', 'erika.lansangan@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-905782'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-22' AND c.start_time = '06:00 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Gabrielle Cruz', 'gabrielle.cruz@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'group', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-914467'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-22' AND c.start_time = '06:00 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Bianca Reyes', 'bianca.reyes@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'any', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-888555'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-22' AND c.start_time = '08:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Hannah Yumul', 'hannah.yumul@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'private', true, 'solo', now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-918829'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-22' AND c.start_time = '10:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Janine Garcia', 'janine.garcia@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-931980'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-23' AND c.start_time = '06:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Nicole Aquino', 'nicole.aquino@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-949662'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-23' AND c.start_time = '08:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Erika Lansangan', 'erika.lansangan@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-905782'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-23' AND c.start_time = '10:00 AM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Sofia Villanueva', 'sofia.villanueva@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'group', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-963060'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-23' AND c.start_time = '10:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Erika Lansangan', 'erika.lansangan@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-905782'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-24' AND c.start_time = '04:00 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Rafael David', 'rafael.david@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-958581'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-24' AND c.start_time = '08:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Nicole Aquino', 'nicole.aquino@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-949662'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-25' AND c.start_time = '09:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Mika Navarro', 'mika.navarro@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-945222'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-25' AND c.start_time = '10:00 AM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Erika Lansangan', 'erika.lansangan@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-905782'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-26' AND c.start_time = '06:00 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Camille Dizon', 'camille.dizon@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-897149'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-26' AND c.start_time = '07:00 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Rafael David', 'rafael.david@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-958581'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-26' AND c.start_time = '08:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Janine Garcia', 'janine.garcia@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-927592'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-27' AND c.start_time = '11:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Erika Lansangan', 'erika.lansangan@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-905782'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-28' AND c.start_time = '06:00 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Danica Manalo', 'danica.manalo@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-901459'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-28' AND c.start_time = '07:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Mika Navarro', 'mika.navarro@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-945222'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-28' AND c.start_time = '07:00 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Camille Dizon', 'camille.dizon@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-892852'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-28' AND c.start_time = '09:00 AM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Danica Manalo', 'danica.manalo@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-901459'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-29' AND c.start_time = '05:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Andrea Santos', 'andrea.santos@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-884271'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-29' AND c.start_time = '07:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Rafael David', 'rafael.david@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-958581'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-29' AND c.start_time = '08:00 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Mika Navarro', 'mika.navarro@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-945222'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-30' AND c.start_time = '05:30 PM' AND c.branch = 'San Fernando' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Janine Garcia', 'janine.garcia@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'reformer', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-927592'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-31' AND c.start_time = '02:00 PM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;
INSERT INTO bookings (class_id, client_name, client_email, spot, reference_id, amount, status, user_package_id, credit_type, is_private, private_kind, reminder_sent_at)
  SELECT c.id, 'Danica Manalo', 'danica.manalo@example.com', s.spot, 'Package #' || up.id, '1 credit', 'confirmed', up.id, 'mat', false, NULL, now()
  FROM classes c
  JOIN user_packages up ON up.reference_id = 'GCASH-901459'
  CROSS JOIN LATERAL (SELECT min(g) AS spot FROM generate_series(1, c.capacity) g
    WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.class_id = c.id AND b.spot = g AND b.status NOT IN ('rejected', 'cancelled'))) s
  WHERE c.class_date = '2026-10-31' AND c.start_time = '10:30 AM' AND c.branch = 'Angeles' AND NOT c.is_cancelled AND s.spot IS NOT NULL;

COMMIT;
