-- Migration: Set phoneVerified=true for existing users who signed up with phone
-- Date: 2025-10-16
-- Description: Update existing users who have contact_number to have phoneVerified=true

-- Update all users who have a contact_number (phone signup) to have phoneVerified=true
UPDATE users 
SET phone_verified = true 
WHERE contact_number IS NOT NULL 
  AND contact_number != '' 
  AND phone_verified = false;

-- Verification query (commented out - for manual verification)
-- SELECT id, username, contact_number, phone_verified, email_verified FROM users;
