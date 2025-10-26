-- Migration: Add image fields to services table
-- Version: V7
-- Description: Add category, image_url, and minicard_image_url columns to services table

-- Add all columns in one statement
ALTER TABLE services 
ADD COLUMN category VARCHAR(100) AFTER base_price,
ADD COLUMN image_url VARCHAR(500) AFTER category,
ADD COLUMN minicard_image_url VARCHAR(500) AFTER image_url;

-- Add index on category for faster queries
CREATE INDEX idx_services_category ON services(category);

-- Add index on service_name for faster lookups (only if not exists)
-- CREATE INDEX idx_services_name ON services(service_name);

-- Update existing services with default category (optional)
-- UPDATE services SET category = 'General' WHERE category IS NULL;

-- Verify the changes
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH, 
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'services' 
  AND TABLE_SCHEMA = DATABASE()
  AND COLUMN_NAME IN ('category', 'image_url', 'minicard_image_url');
