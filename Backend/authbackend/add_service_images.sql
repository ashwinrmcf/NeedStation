-- ============================================
-- Add Service Image Fields Migration
-- ============================================
-- Run this script in your MySQL database
-- Database: needstation (or your database name)
-- ============================================

USE needstation;

-- Step 1: Add new columns to services table
ALTER TABLE services 
ADD COLUMN category VARCHAR(100) AFTER base_price,
ADD COLUMN image_url VARCHAR(500) AFTER category,
ADD COLUMN minicard_image_url VARCHAR(500) AFTER image_url;

-- Step 2: Add indexes for better performance
-- Note: If index already exists, you'll get an error - that's okay, just skip it
CREATE INDEX idx_services_category ON services(category);
-- CREATE INDEX idx_services_name ON services(service_name);  -- Uncomment if needed
-- CREATE INDEX idx_services_active ON services(is_active);   -- Uncomment if needed

-- Step 3: Verify the changes
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH, 
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'services' 
  AND TABLE_SCHEMA = 'needstation'
ORDER BY ORDINAL_POSITION;

-- Step 4: Check current services
SELECT 
    id,
    service_name,
    service_code,
    category,
    image_url,
    minicard_image_url,
    is_active
FROM services
ORDER BY id;

-- ============================================
-- Sample Data Insert (After uploading to Cloudinary)
-- ============================================
-- Replace 'YOUR_CLOUDINARY_URL' with actual Cloudinary URLs

-- Example: Elder Care Services
/*
UPDATE services 
SET 
    category = 'Elder Care',
    minicard_image_url = 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/needstation/minicards/elder_care/ec2_personal.jpg'
WHERE service_name = 'Personal Care';

UPDATE services 
SET 
    category = 'Elder Care',
    minicard_image_url = 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/needstation/minicards/elder_care/ec1_companion.jpg'
WHERE service_name = 'Companion Care';

-- Add more UPDATE statements for all services...
*/

-- ============================================
-- Rollback (if needed)
-- ============================================
/*
ALTER TABLE services 
DROP COLUMN IF EXISTS minicard_image_url,
DROP COLUMN IF EXISTS image_url,
DROP COLUMN IF EXISTS category;

DROP INDEX IF EXISTS idx_services_category ON services;
DROP INDEX IF EXISTS idx_services_name ON services;
DROP INDEX IF EXISTS idx_services_active ON services;
*/
