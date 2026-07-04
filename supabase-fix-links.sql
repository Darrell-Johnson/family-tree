-- ============================================================
-- SAFE, ADDITIVE PATCH — does not delete or overwrite any rows.
-- Run this in your Supabase SQL Editor.
--
-- Fixes two gaps found in the live database:
-- 1. William Jenkins Johnson's five children from his first
--    marriage (to Niece Abraham) had no parent_id set, so they
--    didn't nest under him in the family tree.
-- 2. Edward & Elisa Mothershed's five children had no parent_id
--    set, so they didn't nest under the Mothershed patriarch.
--
-- (The 7 people missing from the live database — J.D. Dixon and
-- grandchildren under Dale/Donna/Chauncey Johnson — were already
-- added directly via the API on 2026-07-04, so this file no longer
-- needs to insert them.)
-- ============================================================

-- 1. William Jenkins Johnson's first-family children
UPDATE members
SET parent_id = '1ad64412-6d6b-4ff9-bafc-718ed880b978' -- William Jenkins Johnson
WHERE id IN (
  '8af23828-1fb7-47f2-9603-d9315fe0e2bd', -- Ocie Johnson-Adams
  '58ca2875-20dd-4050-93e7-c02afc1871da', -- William Mansfield Johnson
  'b1f34c6d-bdee-47f8-96af-6e30ceaf869c', -- Robert Mencer Johnson
  '26060874-1ab0-42d7-915d-30bd23291389', -- A.C. Johnson
  'f5e6f7f8-2edf-4177-990c-5d009b4d6b01'  -- Lillie Belle Johnson-Stevenson
);

-- 2. Edward Mothershed's children
UPDATE members
SET parent_id = '657222fe-af33-4ba0-919e-982a84acd23f' -- Edward Mothershed
WHERE id IN (
  '8910598d-5613-496a-b7e0-e4d542bcadcd', -- Robert Mothershed
  '6e3bea4f-d6d6-4942-b2f1-72b3cf3d3da7', -- Doctor Mothershed
  '6dddf782-0488-4c71-95b1-8576ed870db4', -- Edmond Mothershed
  'dd9df0bc-93d5-41be-846c-f388368f8494', -- James Mothershed
  'daf5cb2c-2dc5-4641-bfe3-2e798f511bdb'  -- Datom Mothershed
);
