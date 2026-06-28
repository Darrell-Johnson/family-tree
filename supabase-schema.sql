-- ============================================================
-- BENFORD-PENNY-JOHNSON FAMILY TREE — SUPABASE SCHEMA
-- Run this entire file in your Supabase SQL Editor
-- Go to: supabase.com → Your Project → SQL Editor → New Query
-- ============================================================

-- 1. Create the members table
CREATE TABLE IF NOT EXISTS members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  birth_name  TEXT,                   -- maiden name / birth surname if different
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

-- Allow anyone to read
CREATE POLICY "Public read" ON members
  FOR SELECT USING (true);

-- Allow anyone to insert (public form)
CREATE POLICY "Public insert" ON members
  FOR INSERT WITH CHECK (true);

-- 3. Seed data — all members from the original HTML file
INSERT INTO members (first_name, last_name, birth_name, birth_date, death_date, family_line, spouse_name, notes, is_hub) VALUES

-- === BENFORD PATRIARCHS ===
('Milton', 'Benford', NULL, '1854-01-01', NULL, 'Benford', 'Melvenia Safronia Norseweather', 'Patriarch. 9 children on record.', FALSE),
('Melvenia Safronia', 'Norseweather-Benford', 'Norseweather', '1861-01-01', NULL, 'Benford', 'Milton Benford', 'Wife of Milton Benford.', FALSE),

-- === IDA B. — THE HUB ===
('Ida B.', 'Benford-Penny-Johnson', 'Benford', '1887-01-01', '1961-01-01', 'Benford', NULL, 'The family hub. Born Benford, first married Penny, then married Johnson. Connects all three family lines.', TRUE),

-- === BENFORD SIBLINGS ===
('Thomas', 'Benford', NULL, '1882-01-01', NULL, 'Benford', NULL, 'Child of Milton Benford.', FALSE),
('Parlee', 'Benford', NULL, '1883-01-01', NULL, 'Benford', NULL, 'Child of Milton Benford.', FALSE),
('Luvenia', 'Benford-Holley', 'Benford', '1884-01-01', NULL, 'Benford', 'Emmit Holley', 'Child of Milton Benford. Married Emmit Holley.', FALSE),
('Mary', 'Benford', NULL, '1889-01-01', NULL, 'Benford', NULL, 'Child of Milton Benford.', FALSE),
('Jennie', 'Benford', NULL, '1891-01-01', NULL, 'Benford', NULL, 'Child of Milton Benford.', FALSE),
('Burlie', 'Benford', NULL, '1892-01-01', NULL, 'Benford', 'Minnie C. Wilson', 'Child of Milton Benford. Married Minnie C. Wilson.', FALSE),
('Alice', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Milton Benford.', FALSE),
('William Moses', 'Benford', NULL, '1898-01-01', NULL, 'Benford', NULL, 'Child of Milton Benford. 3 children.', FALSE),

-- === HOLLEY BRANCH (Luvenia's children) ===
('Emmit', 'Holley', NULL, '1880-01-01', NULL, 'Holley', 'Luvenia Benford', 'Husband of Luvenia Benford.', FALSE),
('Vesti', 'Holley', NULL, NULL, NULL, 'Holley', NULL, 'Child of Luvenia Benford & Emmit Holley.', FALSE),
('Altine', 'Holley', NULL, NULL, NULL, 'Holley', NULL, 'Child of Luvenia Benford & Emmit Holley.', FALSE),
('Lavell', 'Holley', NULL, NULL, NULL, 'Holley', NULL, 'Child of Luvenia Benford & Emmit Holley.', FALSE),
('J.D.', 'Holley', NULL, NULL, NULL, 'Holley', NULL, 'Child of Luvenia Benford & Emmit Holley.', FALSE),
('Matthew', 'Holley', NULL, '1904-01-01', NULL, 'Holley', NULL, 'Child of Luvenia Benford & Emmit Holley.', FALSE),

-- === BURLIE BENFORD BRANCH ===
('Minnie C.', 'Wilson-Benford', 'Wilson', NULL, NULL, 'Benford', 'Burlie Benford', 'Wife of Burlie Benford.', FALSE),
('Pearl', 'Benford-Miles', 'Benford', '1913-01-01', '1998-01-01', 'Benford', 'Alfred Miles', NULL, FALSE),
('Alfred', 'Miles', NULL, NULL, NULL, 'Miles', 'Pearl Benford', NULL, FALSE),
('Alfred Glen', 'Miles', NULL, NULL, NULL, 'Miles', NULL, 'Child of Pearl Benford & Alfred Miles.', FALSE),
('Fred', 'Benford', NULL, NULL, NULL, 'Benford', 'Ethel Beatrice Benford', NULL, FALSE),
('Ethel Beatrice', 'Benford', NULL, NULL, NULL, 'Benford', 'Fred Benford', NULL, FALSE),
('Freddye Mae', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Fred & Ethel Benford.', FALSE),
('Lavell', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Fred & Ethel Benford.', FALSE),
('Bessie Bea', 'Benford', NULL, '1920-01-01', '2008-01-01', 'Benford', NULL, NULL, FALSE),
('William Avery', 'Benford Jr.', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE),
('Burley Duane', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE),
('Althea Marie', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE),
('Kermit DeKoven', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE),
('Wendell Lynn', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE),
('Michael Edwin', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE),
('Pearl Rena', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of Bessie Bea Benford.', FALSE),
('Burley Marie', 'Benford-Black', 'Benford', '1923-01-01', NULL, 'Benford', 'Ernest Lee Black', NULL, FALSE),
('Ernest Lee', 'Black', NULL, '1923-01-01', '2012-01-01', 'Other', 'Burley Marie Benford', NULL, FALSE),
('Benita', 'Black-White', 'Black', NULL, NULL, 'Other', NULL, 'Child of Burley Marie Benford & Ernest Lee Black.', FALSE),

-- === WILLIAM MOSES BENFORD BRANCH ===
('William', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of William Moses Benford.', FALSE),
('James', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of William Moses Benford.', FALSE),
('Audrey Deloris', 'Benford', NULL, NULL, NULL, 'Benford', NULL, 'Child of William Moses Benford.', FALSE),

-- === PENNY BRANCH ===
('James Roma', 'Penny', NULL, NULL, '1913-01-01', 'Penny', 'Ida B. Benford', '1st husband of Ida B. Benford. Died ~1913.', FALSE),
('Annie Mae', 'Penny-Bell', 'Penny', '1908-09-21', '1977-08-25', 'Penny', 'Isaac Bell', 'Child of Ida B. Benford & James Roma Penny.', FALSE),
('Isaac', 'Bell', NULL, NULL, NULL, 'Bell', 'Annie Mae Penny', NULL, FALSE),
('Alfred', 'Bell', NULL, NULL, NULL, 'Bell', NULL, 'Child of Annie Mae Penny & Isaac Bell.', FALSE),
('Athra Mae', 'Bell', NULL, '1931-01-01', '1938-01-01', 'Bell', NULL, 'Child of Annie Mae Penny & Isaac Bell.', FALSE),
('Rosie Lee', 'Penny-Moland', 'Penny', '1911-04-16', '1985-10-12', 'Penny', 'William Bill Moland', 'Child of Ida B. Benford & James Roma Penny.', FALSE),
('William Bill', 'Moland', NULL, NULL, NULL, 'Moland', 'Rosie Lee Penny', NULL, FALSE),
('Gladys', 'Moland-Montgomery', 'Moland', NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Gracie', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Clifford', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Clarence', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Carl', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Ida', 'Moland-Hagen', 'Moland', NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Bill', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Betty', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Rose Mary', 'Moland-Dayers', 'Moland', NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Aulah', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Leroy', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Calvin', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Linda', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Terry', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Macy', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('O''Neil', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('Karen', 'Moland', NULL, NULL, NULL, 'Moland', NULL, NULL, FALSE),
('James Roma', 'Penny Jr.', NULL, '1912-09-14', '1987-02-11', 'Penny', NULL, 'Child of Ida B. Benford & James Roma Penny.', FALSE),
('Kerry L.', 'Penny', NULL, NULL, NULL, 'Penny', NULL, 'Child of James Roma Penny Jr.', FALSE),
('James Roma', 'Penny III', NULL, NULL, NULL, 'Penny', NULL, 'Child of James Roma Penny Jr.', FALSE),

-- === JOHNSON PATRIARCHS ===
('Richard Israel', 'Johnson', NULL, '1868-01-01', NULL, 'Johnson', 'Margaret Mothershed', 'Johnson patriarch.', FALSE),
('Margaret', 'Mothershed-Johnson', 'Mothershed', '1869-01-01', NULL, 'Johnson', 'Richard Israel Johnson', 'Wife of Richard Israel Johnson.', FALSE),
('William Jenkins', 'Johnson', NULL, '1883-01-01', '1942-01-01', 'Johnson', 'Ida B. Benford', '2nd husband of Ida B. Benford. Son of Richard Israel Johnson.', FALSE),
('Niece', 'Abraham-Johnson', 'Abraham', '1886-01-01', NULL, 'Johnson', 'William Jenkins Johnson', '1st wife of William Jenkins Johnson.', FALSE),

-- === JOHNSON SIBLINGS (Richard''s children) ===
('Hagar', 'Johnson', NULL, '1884-01-01', NULL, 'Johnson', 'Joshua Dixon', NULL, FALSE),
('Joshua', 'Dixon', NULL, NULL, NULL, 'Dixon', 'Hagar Johnson', NULL, FALSE),
('Joshua', 'Dixon Jr.', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Hagar Johnson & Joshua Dixon.', FALSE),
('Jettie Mae', 'Dixon', NULL, NULL, NULL, 'Dixon', NULL, 'Child of Hagar Johnson & Joshua Dixon.', FALSE),
('Jewel', 'Johnson', NULL, '1890-01-01', NULL, 'Johnson', NULL, 'Child of Richard Israel Johnson.', FALSE),
('Hedgwood', 'Johnson', NULL, '1891-01-01', NULL, 'Johnson', NULL, 'Child of Richard Israel Johnson.', FALSE),
('Israel', 'Johnson', NULL, '1900-01-01', '1991-01-01', 'Johnson', 'Beatrice Mary Norling', NULL, FALSE),
('Beatrice Mary', 'Norling-Johnson', 'Norling', NULL, NULL, 'Johnson', 'Israel Johnson', NULL, FALSE),
('Ederson', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Israel Johnson.', FALSE),
('Eddie Robert', 'Johnson', NULL, '1936-01-01', '2007-01-01', 'Johnson', NULL, 'Child of Israel Johnson.', FALSE),
('Rofreca', 'Johnson-Carter', 'Johnson', NULL, NULL, 'Johnson', NULL, 'Child of Eddie Robert Johnson.', FALSE),
('Denise', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Eddie Robert Johnson.', FALSE),
('Makeba', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Eddie Robert Johnson.', FALSE),
('Stephen', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Eddie Robert Johnson.', FALSE),
('Kevin', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Eddie Robert Johnson.', FALSE),
('Tera', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Richard Israel Johnson.', FALSE),
('Susie', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Tera Johnson.', FALSE),
('Oteria', 'Johnson', NULL, NULL, NULL, 'Johnson', NULL, 'Child of Susie Johnson.', FALSE),

-- === IDA''S JOHNSON CHILDREN ===
('Ocie', 'Johnson-Adams', 'Johnson', '1905-11-18', '1955-01-01', 'Johnson', NULL, 'Child of Ida B. Benford & William Jenkins Johnson.', FALSE),
('William Mansfield', 'Johnson', NULL, '1906-12-30', '2011-11-22', 'Johnson', NULL, 'Child of Ida B. Benford & William Jenkins Johnson. Lived 104 years.', FALSE),
('Robert Mencer', 'Johnson', NULL, '1908-05-12', '1995-09-23', 'Johnson', NULL, 'Child of Ida B. Benford & William Jenkins Johnson.', FALSE),
('A.C.', 'Johnson', NULL, '1910-02-20', '2012-10-27', 'Johnson', NULL, 'Child of Ida B. Benford & William Jenkins Johnson. Lived 102 years.', FALSE),
('Lillie Belle', 'Johnson-Stevenson', 'Johnson', '1912-02-23', '1963-01-01', 'Johnson', NULL, 'Child of Ida B. Benford & William Jenkins Johnson.', FALSE),
('Willie "Tott"', 'Johnson', NULL, '1915-11-15', '2006-04-29', 'Johnson', NULL, 'Child of Ida B. Benford & William Jenkins Johnson.', FALSE),
('Roy', 'Johnson', NULL, '1917-01-18', '1988-10-06', 'Johnson', NULL, 'Child of Ida B. Benford & William Jenkins Johnson.', FALSE),
('Raymond', 'Johnson', NULL, '1918-10-25', '1993-04-23', 'Johnson', 'Juanita Andrews', 'Child of Ida B. Benford & William Jenkins Johnson. 5 children.', FALSE),
('Milton Lovell', 'Johnson', NULL, '1921-05-21', '1998-12-01', 'Johnson', NULL, 'Child of Ida B. Benford & William Jenkins Johnson.', FALSE),
('Ida Lucille', 'Johnson-Francisco', 'Johnson', '1923-06-25', '2000-09-09', 'Johnson', 'Felix Francisco', 'Child of Ida B. Benford & William Jenkins Johnson. 7 children.', FALSE),
('Jewel Leon', 'Johnson', NULL, '1926-02-24', NULL, 'Johnson', 'Delores Droke', 'Child of Ida B. Benford & William Jenkins Johnson. 3 children + grandchildren.', FALSE),
('Leo', 'Johnson', NULL, '1928-10-30', NULL, 'Johnson', 'Lucille Taylor', 'Child of Ida B. Benford & William Jenkins Johnson. 11 children.', FALSE),

-- === MOTHERSHED FAMILY ===
('Edward', 'Mothershed', NULL, '1821-01-01', NULL, 'Mothershed', 'Elisa Mothershed', 'Mothershed patriarch.', FALSE),
('Elisa', 'Mothershed', NULL, '1842-01-01', NULL, 'Mothershed', 'Edward Mothershed', 'Mothershed matriarch.', FALSE),
('Robert', 'Mothershed', NULL, '1859-01-01', NULL, 'Mothershed', NULL, 'Child of Edward & Elisa Mothershed.', FALSE),
('Doctor', 'Mothershed', NULL, '1867-01-01', NULL, 'Mothershed', NULL, 'Child of Edward & Elisa Mothershed.', FALSE),
('Edmond', 'Mothershed', NULL, '1872-01-01', NULL, 'Mothershed', NULL, 'Child of Edward & Elisa Mothershed.', FALSE),
('James', 'Mothershed', NULL, '1877-01-01', NULL, 'Mothershed', NULL, 'Child of Edward & Elisa Mothershed.', FALSE),
('Datom', 'Mothershed', NULL, '1879-01-01', NULL, 'Mothershed', NULL, 'Child of Edward & Elisa Mothershed.', FALSE);
