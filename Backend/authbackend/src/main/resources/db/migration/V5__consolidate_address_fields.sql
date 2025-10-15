-- Migration: Consolidate address_line1 and address_line2 into full_address
-- Date: 2025-10-15
-- Description: Replace separate address line fields with a single full_address field

-- Step 1: Add new full_address column
ALTER TABLE users ADD COLUMN full_address TEXT;

-- Step 2: Migrate existing data - combine address_line1 and address_line2
UPDATE users 
SET full_address = CASE 
    WHEN address_line1 IS NOT NULL AND address_line2 IS NOT NULL THEN 
        CONCAT(address_line1, ', ', address_line2)
    WHEN address_line1 IS NOT NULL THEN 
        address_line1
    WHEN address_line2 IS NOT NULL THEN 
        address_line2
    ELSE NULL
END;

-- Step 3: Drop old columns (MySQL syntax)
ALTER TABLE users DROP COLUMN address_line1;
ALTER TABLE users DROP COLUMN address_line2;

-- Verification query (commented out - for manual verification)
-- SELECT id, full_address, city, state FROM users LIMIT 10;
