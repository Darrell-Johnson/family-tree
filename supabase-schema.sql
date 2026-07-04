-- ============================================================
-- BENFORD-PENNY-JOHNSON FAMILY TREE — SUPABASE SCHEMA
--
-- ⚠⚠⚠ DO NOT run this against your live bpjreunion.com project. ⚠⚠⚠
-- Your live database already has more complete and more accurate
-- data than this file (real birthdates, spouses, and members added
-- since this file was written). This script TRUNCATES the members
-- table before reseeding — running it against live data will
-- permanently erase everything that isn't in this file.
--
-- This file exists only as a reference for setting up a brand-new,
-- EMPTY Supabase project from scratch (e.g. a local dev copy, or a
-- fresh start if the live project is ever lost).
--
-- To fix small gaps in the existing live database, use
-- supabase-fix-links.sql instead — it only adds/updates, never deletes.
-- ============================================================

-- 1. Create the members table
CREATE TABLE IF NOT EXISTS members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  birth_name  TEXT,
  birth_date  DATE,
  death_date  DATE,
  family_line TEXT NOT NULL DEFAULT 'Other',
  parent_id   UUID REFERENCES members(id) ON DELETE SET NULL,
  spouse_name TEXT,
  notes       TEXT,
  is_hub      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS) — allow public reads and inserts
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read" ON members;
CREATE POLICY "Public read" ON members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert" ON members;
CREATE POLICY "Public insert" ON members
  FOR INSERT WITH CHECK (true);

-- 3. Clear existing rows and reseed (see warning above)
TRUNCATE TABLE members RESTART IDENTITY;

-- 4. Temporary columns used only to wire up parent/child links during seeding
ALTER TABLE members ADD COLUMN IF NOT EXISTS temp_key TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS parent_key TEXT;

-- 5. Seed data — all members, including full descendant lines
INSERT INTO members (first_name, last_name, birth_name, birth_date, death_date, family_line, spouse_name, notes, is_hub, temp_key, parent_key) VALUES
('Milton', 'Benford', NULL, '1854-01-01', NULL, 'Benford', 'Melvenia Safronia Norseweather', 'Patriarch. 9 children on record.', FALSE, 'milton_benford', NULL),
('Melvenia Safronia', 'Norseweather-Benford', 'Norseweather', '1861-01-01', NULL, 'Benford', 'Milton Benford', 'Wife of Milton Benford.', FALSE, 'melvenia_norseweather', NULL),
('Ida B.', 'Benford-Penny-Johnson', 'Benford', '1887-01-01', '1961-01-01', 'Benford', NULL, 'The family hub. Born Benford, first married Penny, then married Johnson. Connects all three family lines.', TRUE, 'ida', 'milton_benford'),
('Thomas', 'Benford', NULL, '1882-01-01', NULL, 'Benford', NULL, 'Child of Milton Benford.', FALSE, 'thomas_benford', 'milton_benford'),
('Parlee', 'Benford', NULL, '1883-01-01', NULL, 'Benford', NULL, 'Child of Milton Benford.', FALSE, 'parlee_benford', 'milton_benford'),
('Luvenia', 'Benford-Holley', 'Benford', '1884-01-01', NULL, 'Benford', 'Emmit Holley', 'Child of Milton Benford. Married Emmit Holley.', FALSE, 'luvenia_holley', 'milton_benford'),
('Mary', 'Benford', NULL, '1889-01-01', NULL, 'Benford', NULL, 'Child of Milton Benford.', FALSE, 'mary_benford', 'milton_benford'),
('Jennie', 'Benford', NULL, '1891-01-01', NULL, 'Benford', NULL, 'Child of Milton Benford.', FALSE, 'jennie_benford', 'milton_benford'),
('Burlie', 'Benford', NULL, '1892-01-01', NULL, 'Benford', 'Minnie C. Wilson', 'Child of Milton Benford. Married Minnie C. Wilson.', FALSE, 'burlie_benford', 'milton_benford'),
('Alice', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Milton Benford.', FALSE, 'alice_benford', 'milton_benford'),
('William Moses', 'Benford', NULL, '1898-01-01', NULL, 'Benford', NULL, 'Child of Milton Benford. 3 children.', FALSE, 'wm_moses_benford', 'milton_benford'),
('Emmit', 'Holley', NULL, '1880-01-01', NULL, 'Holley', 'Luvenia Benford', 'Husband of Luvenia Benford.', FALSE, 'emmit_holley', NULL),
('Vesti', 'Holley', NULL, NULL, NULL, 'Holley', NULL, 'Child of Luvenia Benford & Emmit Holley.', FALSE, 'vesti_holley', 'luvenia_holley'),
('Altine', 'Holley', NULL, NULL, NULL, 'Holley', NULL, 'Child of Luvenia Benford & Emmit Holley.', FALSE, 'altine_holley', 'luvenia_holley'),
('Lavell', 'Holley', NULL, NULL, NULL, 'Holley', NULL, 'Child of Luvenia Benford & Emmit Holley.', FALSE, 'lavell_holley', 'luvenia_holley'),
('J.D.', 'Holley', NULL, NULL, NULL, 'Holley', NULL, 'Child of Luvenia Benford & Emmit Holley.', FALSE, 'jd_holley', 'luvenia_holley'),
('Matthew', 'Holley', NULL, '1904-01-01', NULL, 'Holley', NULL, 'Child of Luvenia Benford & Emmit Holley.', FALSE, 'matthew_holley', 'luvenia_holley'),
('Minnie C.', 'Wilson-Benford', 'Wilson', NULL, NULL, 'Benford', 'Burlie Benford', 'Wife of Burlie Benford.', FALSE, 'minnie_wilson_benford', NULL),
('Pearl', 'Benford-Miles', 'Benford', '1913-01-01', '1998-01-01', 'Benford', 'Alfred Miles', NULL, FALSE, 'pearl_benford_miles', 'burlie_benford'),
('Alfred', 'Miles', NULL, NULL, NULL, 'Miles', 'Pearl Benford', NULL, FALSE, 'alfred_miles', NULL),
('Alfred Glen', 'Miles', NULL, NULL, NULL, 'Miles', NULL, 'Child of Pearl Benford & Alfred Miles.', FALSE, 'alfred_glen_miles', 'pearl_benford_miles'),
('Fred', 'Benford', NULL, NULL, NULL, 'Benford', 'Ethel Beatrice Benford', NULL, FALSE, 'fred_benford', 'burlie_benford'),
('Ethel Beatrice', 'Benford', NULL, NULL, NULL, 'Benford', 'Fred Benford', NULL, FALSE, 'ethel_beatrice_benford', NULL),
('Freddye Mae', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Fred & Ethel Benford.', FALSE, 'freddye_mae_benford', 'fred_benford'),
('Lavell', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Fred & Ethel Benford.', FALSE, 'lavell_benford', 'fred_benford'),
('Bessie Bea', 'Benford', NULL, '1920-01-01', '2008-01-01', 'Benford', NULL, NULL, FALSE, 'bessie_bea_benford', 'burlie_benford'),
('William Avery', 'Benford Jr.', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE, 'william_avery_benford_jr', 'bessie_bea_benford'),
('Burley Duane', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE, 'burley_duane_benford', 'bessie_bea_benford'),
('Althea Marie', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE, 'althea_marie_benford', 'bessie_bea_benford'),
('Kermit DeKoven', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE, 'kermit_dekoven_benford', 'bessie_bea_benford'),
('Wendell Lynn', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE, 'wendell_lynn_benford', 'bessie_bea_benford'),
('Michael Edwin', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE, 'michael_edwin_benford', 'bessie_bea_benford'),
('Pearl Rena', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE, 'pearl_rena_benford', 'bessie_bea_benford'),
('Burley Marie', 'Benford-Black', 'Benford', '1923-01-01', NULL, 'Benford', 'Ernest Lee Black', NULL, FALSE, 'burley_marie_benford_black', 'burlie_benford'),
('Ernest Lee', 'Black', NULL, '1923-01-01', '2012-01-01', 'Other', 'Burley Marie Benford', NULL, FALSE, 'ernest_lee_black', NULL),
('Benita', 'Black-White', 'Black', NULL, NULL, 'Other', NULL, 'Child of Burley Marie Benford & Ernest Lee Black.', FALSE, 'benita_black_white', 'burley_marie_benford_black'),
('William', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of William Moses Benford.', FALSE, 'william_benford_moses', 'wm_moses_benford'),
('James', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of William Moses Benford.', FALSE, 'james_benford_moses', 'wm_moses_benford'),
('Audrey Deloris', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of William Moses Benford.', FALSE, 'audrey_deloris_benford', 'wm_moses_benford'),
('James Roma', 'Penny', NULL, NULL, '1913-01-01', 'Penny', 'Ida B. Benford', '1st husband of Ida B. Benford. Died ~1913.', FALSE, 'james_roma_penny', NULL),
('Annie Mae', 'Penny-Bell', 'Penny', '1908-09-21', '1977-08-25', 'Penny', 'Isaac Bell', 'Child of Ida B. Benford & James Roma Penny.', FALSE, 'annie_mae_penny_bell', 'ida'),
('Isaac', 'Bell', NULL, NULL, NULL, 'Bell', 'Annie Mae Penny', NULL, FALSE, 'isaac_bell', NULL),
('Alfred', 'Bell', NULL, NULL, NULL, 'Bell', NULL, 'Child of Annie Mae Penny & Isaac Bell.', FALSE, 'alfred_bell', 'annie_mae_penny_bell'),
('Athra Mae', 'Bell', NULL, '1931-01-01', '1938-01-01', 'Bell', NULL, 'Child of Annie Mae Penny & Isaac Bell.', FALSE, 'athra_mae_bell', 'annie_mae_penny_bell'),
('Rosie Lee', 'Penny-Moland', 'Penny', '1911-04-16', '1985-10-12', 'Penny', 'William Bill Moland', 'Child of Ida B. Benford & James Roma Penny.', FALSE, 'rosie_lee_penny_moland', 'ida'),
('William Bill', 'Moland', NULL, NULL, NULL, 'Moland', 'Rosie Lee Penny', NULL, FALSE, 'william_bill_moland', NULL),
('Gladys', 'Moland-Montgomery', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_0', 'rosie_lee_penny_moland'),
('Gracie', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_1', 'rosie_lee_penny_moland'),
('Clifford', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_2', 'rosie_lee_penny_moland'),
('Clarence', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_3', 'rosie_lee_penny_moland'),
('Carl', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_4', 'rosie_lee_penny_moland'),
('Ida', 'Moland-Hagen', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_5', 'rosie_lee_penny_moland'),
('Bill', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_6', 'rosie_lee_penny_moland'),
('Betty', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_7', 'rosie_lee_penny_moland'),
('Rose Mary', 'Moland-Dayers', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_8', 'rosie_lee_penny_moland'),
('Aulah', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_9', 'rosie_lee_penny_moland'),
('Leroy', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_10', 'rosie_lee_penny_moland'),
('Calvin', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_11', 'rosie_lee_penny_moland'),
('Linda', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_12', 'rosie_lee_penny_moland'),
('Terry', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_13', 'rosie_lee_penny_moland'),
('Macy', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_14', 'rosie_lee_penny_moland'),
('O''Neil', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_15', 'rosie_lee_penny_moland'),
('Karen', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE, 'moland_16', 'rosie_lee_penny_moland'),
('James Roma', 'Penny Jr.', NULL, '1912-09-14', '1987-02-11', 'Penny', NULL, 'Child of Ida B. Benford & James Roma Penny.', FALSE, 'james_roma_penny_jr', 'ida'),
('Kerry L.', 'Penny', NULL, NULL, NULL, 'Penny', NULL, 'Child of James Roma Penny Jr.', FALSE, 'kerry_l_penny', 'james_roma_penny_jr'),
('James Roma', 'Penny III', NULL, NULL, NULL, 'Penny', NULL, 'Child of James Roma Penny Jr.', FALSE, 'james_roma_penny_iii', 'james_roma_penny_jr'),
('Richard Israel', 'Johnson', NULL, '1868-01-01', NULL, 'Johnson', 'Margaret Mothershed', 'Johnson patriarch.', FALSE, 'richard_israel_johnson', NULL),
('Margaret', 'Mothershed-Johnson', 'Mothershed', '1869-01-01', NULL, 'Johnson', 'Richard Israel Johnson', 'Wife of Richard Israel Johnson.', FALSE, 'margaret_mothershed_johnson', NULL),
('William Jenkins', 'Johnson', NULL, '1883-01-01', '1942-01-01', 'Johnson', 'Ida B. Benford', '2nd husband of Ida B. Benford. Son of Richard Israel Johnson.', FALSE, 'wm_jenkins_johnson', 'richard_israel_johnson'),
('Niece', 'Abraham-Johnson', 'Abraham', '1886-01-01', NULL, 'Johnson', 'William Jenkins Johnson', '1st wife of William Jenkins Johnson.', FALSE, 'niece_abraham_johnson', NULL),
('Hagar', 'Johnson', NULL, '1884-01-01', NULL, 'Johnson', 'Joshua Dixon', NULL, FALSE, 'hagar_johnson', 'richard_israel_johnson'),
('Joshua', 'Dixon', NULL, NULL, NULL, 'Dixon', 'Hagar Johnson', NULL, FALSE, 'joshua_dixon', NULL),
('Joshua', 'Dixon Jr.', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Hagar Johnson & Joshua Dixon.', FALSE, 'joshua_dixon_jr', 'hagar_johnson'),
('Jettie Mae', 'Dixon', NULL, NULL, NULL, 'Dixon', 'Zacharia Banks', 'Child of Hagar Johnson & Joshua Dixon.', FALSE, 'jettie_mae_dixon', 'hagar_johnson'),
('J.D.', 'Dixon', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Hagar Johnson & Joshua Dixon.', FALSE, 'jd_dixon', 'hagar_johnson'),
('Rosie Lee', 'Dixon', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Hagar Johnson & Joshua Dixon.', FALSE, 'rosie_lee_dixon', 'hagar_johnson'),
('Inez', 'Dixon', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Hagar Johnson & Joshua Dixon.', FALSE, 'inez_dixon', 'hagar_johnson'),
('Euradell', 'Dixon-Childs', 'Dixon', NULL, NULL, 'Dixon', NULL, 'Child of Hagar Johnson & Joshua Dixon.', FALSE, 'euradell_dixon_childs', 'hagar_johnson'),
('Purnese', 'Dixon-Hamilton', 'Dixon', NULL, NULL, 'Dixon', NULL, 'Child of Hagar Johnson & Joshua Dixon.', FALSE, 'purnese_dixon_hamilton', 'hagar_johnson'),
('Anita', 'Dixon', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Hagar Johnson & Joshua Dixon.', FALSE, 'anita_dixon', 'hagar_johnson'),
('Naomi', 'Dixon', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Hagar Johnson & Joshua Dixon.', FALSE, 'naomi_dixon', 'hagar_johnson'),
('Zerah', 'Banks', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Jettie Mae Dixon & Zacharia Banks.', FALSE, 'banks_0', 'jettie_mae_dixon'),
('Leo Earnest', 'Banks', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Jettie Mae Dixon & Zacharia Banks.', FALSE, 'banks_1', 'jettie_mae_dixon'),
('Robert', 'Banks', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Jettie Mae Dixon & Zacharia Banks.', FALSE, 'banks_2', 'jettie_mae_dixon'),
('Lennest', 'Banks', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Jettie Mae Dixon & Zacharia Banks.', FALSE, 'banks_3', 'jettie_mae_dixon'),
('Juanita', 'Banks', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Jettie Mae Dixon & Zacharia Banks.', FALSE, 'banks_4', 'jettie_mae_dixon'),
('Joe Nathan', 'Banks', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Jettie Mae Dixon & Zacharia Banks.', FALSE, 'banks_5', 'jettie_mae_dixon'),
('Jewel', 'Johnson', NULL, '1890-01-01', NULL, 'Johnson', NULL, 'Child of Richard Israel Johnson.', FALSE, 'jewel_johnson_sr', 'richard_israel_johnson'),
('Hedgwood', 'Johnson', NULL, '1891-01-01', NULL, 'Johnson', NULL, 'Child of Richard Israel Johnson.', FALSE, 'hedgwood_johnson', 'richard_israel_johnson'),
('Israel', 'Johnson', NULL, '1900-01-01', '1991-01-01', 'Johnson', 'Beatrice Mary Norling', NULL, FALSE, 'israel_johnson', 'richard_israel_johnson'),
('Beatrice Mary', 'Norling-Johnson', 'Norling', NULL, NULL, 'Johnson', 'Israel Johnson', NULL, FALSE, 'beatrice_norling_johnson', NULL),
('Ederson', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Israel Johnson.', FALSE, 'ederson_johnson', 'israel_johnson'),
('Eddie Robert', 'Johnson', NULL, '1936-01-01', '2007-01-01', 'Johnson', 'Clarissa Bowers', 'Child of Israel Johnson.', FALSE, 'eddie_robert_johnson', 'israel_johnson'),
('Rofreca', 'Johnson-Carter', 'Johnson', NULL, NULL, 'Johnson', NULL, 'Child of Eddie Robert Johnson.', FALSE, 'rofreca_johnson_carter', 'eddie_robert_johnson'),
('Denise', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Eddie Robert Johnson.', FALSE, 'denise_johnson', 'eddie_robert_johnson'),
('Makeba', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Eddie Robert Johnson.', FALSE, 'makeba_johnson', 'eddie_robert_johnson'),
('Stephen', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Eddie Robert Johnson.', FALSE, 'stephen_johnson', 'eddie_robert_johnson'),
('Kevin', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Eddie Robert Johnson.', FALSE, 'kevin_johnson_eddie', 'eddie_robert_johnson'),
('Tera', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Richard Israel Johnson.', FALSE, 'tera_johnson', 'richard_israel_johnson'),
('Susie', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Tera Johnson.', FALSE, 'susie_johnson', 'tera_johnson'),
('Oteria', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Susie Johnson.', FALSE, 'oteria_johnson', 'susie_johnson'),
('Ocie', 'Johnson-Adams', 'Johnson', '1905-11-18', '1955-01-01', 'Johnson', 'William Adams', 'Child of William Jenkins Johnson & Niece Abraham.', FALSE, 'ocie_mae_johnson_adams', 'wm_jenkins_johnson'),
('Frances', 'Adams-Chandler', 'Adams', '1931-01-01', NULL, 'Johnson', 'Joseph Chandler', 'Child of Ocie Mae Johnson-Adams & William Adams.', FALSE, 'frances_adams_chandler', 'ocie_mae_johnson_adams'),
('Phyllis', 'Chandler', NULL, '1952-01-01', NULL, 'Johnson', NULL, 'Child of Frances Adams-Chandler & Joseph Chandler.', FALSE, 'phyllis_chandler', 'frances_adams_chandler'),
('Charles', 'Chandler', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Frances Adams-Chandler & Joseph Chandler.', FALSE, 'charles_chandler', 'frances_adams_chandler'),
('William', 'Adams Jr.', NULL, '1933-01-01', '2009-01-01', 'Johnson', NULL, 'Child of Ocie Mae Johnson-Adams & William Adams.', FALSE, 'william_adams_jr', 'ocie_mae_johnson_adams'),
('Lillie Mae', 'Adams-Bramlett', 'Adams', '1936-01-01', '1998-01-01', 'Johnson', 'Bramlett', 'Child of Ocie Mae Johnson-Adams & William Adams.', FALSE, 'lillie_mae_adams_bramlett', 'ocie_mae_johnson_adams'),
('Robin', 'Bramlett', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Lillie Mae Adams-Bramlett.', FALSE, 'robin_bramlett', 'lillie_mae_adams_bramlett'),
('William Mansfield', 'Johnson', NULL, '1906-12-30', '2011-11-22', 'Johnson', 'Earlina Dennis / Fatrie Jenkins', 'Child of William Jenkins Johnson & Niece Abraham. Lived 104 years.', FALSE, 'william_mansfield_johnson', 'wm_jenkins_johnson'),
('Ruby Mae', 'Johnson-Gibson', 'Johnson', NULL, NULL, 'Johnson', NULL, 'Child of William Mansfield Johnson & Earlina Dennis.', FALSE, 'ruby_mae_johnson_gibson', 'william_mansfield_johnson'),
('William Mansfield', 'Johnson Jr.', NULL, NULL, NULL, 'Johnson', NULL, 'Child of William Mansfield Johnson & Fatrie Jenkins.', FALSE, 'william_mansfield_jr', 'william_mansfield_johnson'),
('Rudolph L.', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of William Mansfield Johnson & Fatrie Jenkins.', FALSE, 'rudolph_l_johnson', 'william_mansfield_johnson'),
('Robert Mencer', 'Johnson', NULL, '1908-05-12', '1995-09-23', 'Johnson', 'Gladys Johnson / Catherine Fobbs', 'Child of William Jenkins Johnson & Niece Abraham.', FALSE, 'robert_mencer_johnson', 'wm_jenkins_johnson'),
('Lorinzo', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Robert Mencer Johnson & Gladys Johnson.', FALSE, 'rmj_gladys_0', 'robert_mencer_johnson'),
('Nathaniel', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Robert Mencer Johnson & Gladys Johnson.', FALSE, 'rmj_gladys_1', 'robert_mencer_johnson'),
('Calvin', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Robert Mencer Johnson & Gladys Johnson.', FALSE, 'rmj_gladys_2', 'robert_mencer_johnson'),
('Carrie', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Robert Mencer Johnson & Gladys Johnson.', FALSE, 'rmj_gladys_3', 'robert_mencer_johnson'),
('Niece', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Robert Mencer Johnson & Gladys Johnson.', FALSE, 'rmj_gladys_4', 'robert_mencer_johnson'),
('Jacqueline', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Robert Mencer Johnson & Gladys Johnson.', FALSE, 'rmj_gladys_5', 'robert_mencer_johnson'),
('Robert', 'Johnson Jr.', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Robert Mencer Johnson & Catherine Fobbs.', FALSE, 'rmj_fobbs_0', 'robert_mencer_johnson'),
('Alvin', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Robert Mencer Johnson & Catherine Fobbs.', FALSE, 'rmj_fobbs_1', 'robert_mencer_johnson'),
('Ora Lee', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Robert Mencer Johnson & Catherine Fobbs.', FALSE, 'rmj_fobbs_2', 'robert_mencer_johnson'),
('A.C.', 'Johnson', NULL, '1910-02-20', '2012-10-27', 'Johnson', 'Gay Bertha / Castella Rolfe', 'Child of William Jenkins Johnson & Niece Abraham. Lived 102 years.', FALSE, 'ac_johnson', 'wm_jenkins_johnson'),
('Lillie Belle', 'Johnson-Stevenson', 'Johnson', '1912-02-23', '1963-01-01', 'Johnson', 'Leslie "Johnny" Stevenson', 'Child of William Jenkins Johnson & Niece Abraham.', FALSE, 'lillie_belle_johnson_stevenson', 'wm_jenkins_johnson'),
('Betty Jean', 'Logan-Gracey', NULL, '1932-01-01', NULL, 'Johnson', NULL, 'Child of Lillie Belle Johnson-Stevenson & Leslie Stevenson.', FALSE, 'betty_jean_logan_gracey', 'lillie_belle_johnson_stevenson'),
('Willie "Tott"', 'Johnson', NULL, '1915-11-15', '2006-04-29', 'Johnson', NULL, 'Child of Ida B. Benford & William Jenkins Johnson.', FALSE, 'willie_tott_johnson', 'ida'),
('Roy', 'Johnson', NULL, '1917-01-18', '1988-10-06', 'Johnson', NULL, 'Child of Ida B. Benford & William Jenkins Johnson.', FALSE, 'roy_johnson', 'ida'),
('Raymond', 'Johnson', NULL, '1918-10-25', '1993-04-23', 'Johnson', 'Juanita Andrews', 'Child of Ida B. Benford & William Jenkins Johnson. 5 children.', FALSE, 'raymond_johnson', 'ida'),
('Tommy', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Raymond Johnson & Juanita Andrews.', FALSE, 'raymond_kid_0', 'raymond_johnson'),
('Kevin', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Raymond Johnson & Juanita Andrews.', FALSE, 'raymond_kid_1', 'raymond_johnson'),
('April Joy', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Raymond Johnson & Juanita Andrews.', FALSE, 'raymond_kid_2', 'raymond_johnson'),
('Teresa', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Raymond Johnson & Juanita Andrews.', FALSE, 'raymond_kid_3', 'raymond_johnson'),
('Sherry', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Raymond Johnson & Juanita Andrews.', FALSE, 'raymond_kid_4', 'raymond_johnson'),
('Milton Lovell', 'Johnson', NULL, '1921-05-21', '1998-12-01', 'Johnson', 'Johnnye Lee Carter', 'Child of Ida B. Benford & William Jenkins Johnson.', FALSE, 'milton_lovell_johnson', 'ida'),
('Ida Lucille', 'Johnson-Francisco', 'Johnson', '1923-06-25', '2000-09-09', 'Johnson', 'Felix Francisco', 'Child of Ida B. Benford & William Jenkins Johnson. 7 children.', FALSE, 'ida_lucille_johnson_francisco', 'ida'),
('Felix Oliver', 'Francisco', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Ida Lucille Johnson-Francisco & Felix Francisco.', FALSE, 'francisco_kid_0', 'ida_lucille_johnson_francisco'),
('Evelyn', 'Francisco', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Ida Lucille Johnson-Francisco & Felix Francisco.', FALSE, 'francisco_kid_1', 'ida_lucille_johnson_francisco'),
('Elaine', 'Francisco', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Ida Lucille Johnson-Francisco & Felix Francisco.', FALSE, 'francisco_kid_2', 'ida_lucille_johnson_francisco'),
('Loretta Lavern', 'Francisco', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Ida Lucille Johnson-Francisco & Felix Francisco.', FALSE, 'francisco_kid_3', 'ida_lucille_johnson_francisco'),
('Kenneth', 'Francisco', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Ida Lucille Johnson-Francisco & Felix Francisco.', FALSE, 'francisco_kid_4', 'ida_lucille_johnson_francisco'),
('Marva', 'Francisco', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Ida Lucille Johnson-Francisco & Felix Francisco.', FALSE, 'francisco_kid_5', 'ida_lucille_johnson_francisco'),
('Melva', 'Francisco', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Ida Lucille Johnson-Francisco & Felix Francisco.', FALSE, 'francisco_kid_6', 'ida_lucille_johnson_francisco'),
('Jewel Leon', 'Johnson', NULL, '1926-02-24', NULL, 'Johnson', 'Delores Droke', 'Child of Ida B. Benford & William Jenkins Johnson. 3 children + grandchildren.', FALSE, 'jewel_leon_johnson', 'ida'),
('Luvenia Oretha', 'Johnson-Ivy', 'Johnson', '1950-01-01', NULL, 'Johnson', 'Dwight Ivy', 'Child of Jewel Leon Johnson & Delores Droke.', FALSE, 'luvenia_oretha_johnson_ivy', 'jewel_leon_johnson'),
('Benjamin Dwayne', 'Ivy', NULL, '1988-01-01', NULL, 'Johnson', NULL, 'Child of Luvenia Oretha Johnson-Ivy & Dwight Ivy.', FALSE, 'benjamin_dwayne_ivy', 'luvenia_oretha_johnson_ivy'),
('Travis Lavon', 'Johnson', NULL, '1951-01-01', '2010-01-01', 'Johnson', 'Alice Chandler', 'Child of Jewel Leon Johnson & Delores Droke.', FALSE, 'travis_lavon_johnson', 'jewel_leon_johnson'),
('Alicia', 'Johnson', NULL, '1976-01-01', NULL, 'Johnson', NULL, 'Child of Travis Lavon Johnson & Alice Chandler.', FALSE, 'travis_kid_0', 'travis_lavon_johnson'),
('Travis Issac', 'Johnson', NULL, '1979-01-01', NULL, 'Johnson', NULL, 'Child of Travis Lavon Johnson & Alice Chandler.', FALSE, 'travis_kid_1', 'travis_lavon_johnson'),
('Aaron', 'Johnson', NULL, '1982-01-01', NULL, 'Johnson', NULL, 'Child of Travis Lavon Johnson & Alice Chandler.', FALSE, 'travis_kid_2', 'travis_lavon_johnson'),
('Alillia', 'Johnson', NULL, '1985-01-01', NULL, 'Johnson', NULL, 'Child of Travis Lavon Johnson & Alice Chandler.', FALSE, 'travis_kid_3', 'travis_lavon_johnson'),
('Bryce', 'Johnson', NULL, '1987-01-01', NULL, 'Johnson', NULL, 'Child of Travis Lavon Johnson & Alice Chandler.', FALSE, 'travis_kid_4', 'travis_lavon_johnson'),
('Lucinda Oleatha', 'Johnson-Grevious', 'Johnson', '1954-01-01', NULL, 'Johnson', 'Jarvio Grevious', 'Child of Jewel Leon Johnson & Delores Droke.', FALSE, 'lucinda_oleatha_johnson_grevious', 'jewel_leon_johnson'),
('Alysha', 'Grevious', NULL, '1982-01-01', NULL, 'Johnson', NULL, 'Child of Lucinda Oleatha Johnson-Grevious & Jarvio Grevious.', FALSE, 'lucinda_kid_0', 'lucinda_oleatha_johnson_grevious'),
('Adrienne', 'Grevious', NULL, '1987-01-01', NULL, 'Johnson', NULL, 'Child of Lucinda Oleatha Johnson-Grevious & Jarvio Grevious.', FALSE, 'lucinda_kid_1', 'lucinda_oleatha_johnson_grevious'),
('Leo', 'Johnson', NULL, '1928-10-30', NULL, 'Johnson', 'Lucille Taylor', 'Child of Ida B. Benford & William Jenkins Johnson. 11 children.', FALSE, 'leo_johnson', 'ida'),
('Carol', 'Johnson', NULL, '1950-01-01', NULL, 'Johnson', NULL, 'Child of Leo Johnson & Lucille Taylor.', FALSE, 'leo_kid_0', 'leo_johnson'),
('Roy', 'Johnson', NULL, '1952-01-01', NULL, 'Johnson', NULL, 'Child of Leo Johnson & Lucille Taylor.', FALSE, 'leo_kid_1', 'leo_johnson'),
('Myron', 'Johnson', NULL, '1952-01-01', NULL, 'Johnson', NULL, 'Child of Leo Johnson & Lucille Taylor.', FALSE, 'leo_kid_2', 'leo_johnson'),
('Gerard', 'Johnson', NULL, '1955-01-01', NULL, 'Johnson', NULL, 'Child of Leo Johnson & Lucille Taylor.', FALSE, 'leo_kid_3', 'leo_johnson'),
('Linda', 'Johnson', NULL, '1957-01-01', NULL, 'Johnson', NULL, 'Child of Leo Johnson & Lucille Taylor.', FALSE, 'leo_kid_4', 'leo_johnson'),
('Shirley', 'Johnson', NULL, '1959-01-01', NULL, 'Johnson', NULL, 'Child of Leo Johnson & Lucille Taylor.', FALSE, 'leo_kid_5', 'leo_johnson'),
('Dale', 'Johnson', NULL, '1961-01-01', NULL, 'Johnson', NULL, 'Child of Leo Johnson & Lucille Taylor.', FALSE, 'leo_kid_6', 'leo_johnson'),
('Darrell', 'Johnson', NULL, '1963-01-01', NULL, 'Johnson', NULL, 'Child of Leo Johnson & Lucille Taylor.', FALSE, 'leo_kid_7', 'leo_johnson'),
('Beverly', 'Johnson', NULL, '1965-01-01', NULL, 'Johnson', NULL, 'Child of Leo Johnson & Lucille Taylor.', FALSE, 'leo_kid_8', 'leo_johnson'),
('Donna', 'Johnson', NULL, '1969-01-01', NULL, 'Johnson', NULL, 'Child of Leo Johnson & Lucille Taylor.', FALSE, 'leo_kid_9', 'leo_johnson'),
('Chauncey', 'Johnson', NULL, '1970-01-01', NULL, 'Johnson', NULL, 'Child of Leo Johnson & Lucille Taylor.', FALSE, 'leo_kid_10', 'leo_johnson'),
('Jamil', 'Johnson', NULL, '1985-01-01', NULL, 'Johnson', NULL, 'Child of Linda Johnson.', FALSE, 'linda_johnson_leo_child_jamil', 'leo_kid_4'),
('Stephanie', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Linda Johnson.', FALSE, 'linda_johnson_leo_child_stephanie', 'leo_kid_4'),
('Danielle', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Dale Johnson.', FALSE, 'dale_johnson_child_danielle', 'leo_kid_6'),
('Courtney', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Dale Johnson.', FALSE, 'dale_johnson_child_courtney', 'leo_kid_6'),
('Serena', 'Johnson', NULL, '1985-01-01', NULL, 'Johnson', NULL, 'Child of Darrell Johnson.', FALSE, 'darrell_johnson_child_serena', 'leo_kid_7'),
('Cameron', 'Johnson', NULL, '1987-01-01', NULL, 'Johnson', NULL, 'Child of Darrell Johnson.', FALSE, 'darrell_johnson_child_cameron', 'leo_kid_7'),
('Brittani', 'Johnson', NULL, '1996-01-01', NULL, 'Johnson', NULL, 'Child of Donna Johnson.', FALSE, 'donna_johnson_child_brittani', 'leo_kid_9'),
('Chauncey', 'Johnson Jr.', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Chauncey Johnson.', FALSE, 'chauncey_johnson_child_jr', 'leo_kid_10'),
('Christin', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Chauncey Johnson.', FALSE, 'chauncey_johnson_child_christin', 'leo_kid_10'),
('Jalin', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Chauncey Johnson.', FALSE, 'chauncey_johnson_child_jalin', 'leo_kid_10'),
('Edward', 'Mothershed', NULL, '1821-01-01', NULL, 'Mothershed', 'Elisa Mothershed', 'Mothershed patriarch.', FALSE, 'edward_mothershed', NULL),
('Elisa', 'Mothershed', NULL, '1842-01-01', NULL, 'Mothershed', 'Edward Mothershed', 'Mothershed matriarch.', FALSE, 'elisa_mothershed', NULL),
('Robert', 'Mothershed', NULL, '1859-01-01', NULL, 'Mothershed', NULL, 'Child of Edward & Elisa Mothershed.', FALSE, 'robert_mothershed', 'edward_mothershed'),
('Doctor', 'Mothershed', NULL, '1867-01-01', NULL, 'Mothershed', NULL, 'Child of Edward & Elisa Mothershed.', FALSE, 'doctor_mothershed', 'edward_mothershed'),
('Edmond', 'Mothershed', NULL, '1872-01-01', NULL, 'Mothershed', NULL, 'Child of Edward & Elisa Mothershed.', FALSE, 'edmond_mothershed', 'edward_mothershed'),
('James', 'Mothershed', NULL, '1877-01-01', NULL, 'Mothershed', NULL, 'Child of Edward & Elisa Mothershed.', FALSE, 'james_mothershed', 'edward_mothershed'),
('Datom', 'Mothershed', NULL, '1879-01-01', NULL, 'Mothershed', NULL, 'Child of Edward & Elisa Mothershed.', FALSE, 'datom_mothershed', 'edward_mothershed');

-- 6. Wire up parent_id from parent_key, then drop the temporary columns
UPDATE members child
SET parent_id = parent.id
FROM members parent
WHERE child.parent_key = parent.temp_key;

ALTER TABLE members DROP COLUMN temp_key;
ALTER TABLE members DROP COLUMN parent_key;

