-- Test script to add quotation data to an existing booking
-- Replace the booking_number with your actual booking number from the screenshot

-- Example: Update booking with quotation
UPDATE bookings 
SET 
    quotation_amount = 2500.00,
    quotation_details = 'Professional dementia care service includes: 24/7 monitoring, medication management, cognitive therapy sessions, and personalized care plan. All equipment and supplies included.',
    quotation_provided_at = NOW(),
    quotation_status = 'PROVIDED'
WHERE booking_number = '20250131-00001'  -- Replace with your actual booking number
AND status IN ('CONFIRMED', 'ASSIGNED');

-- Verify the update
SELECT 
    id,
    booking_number,
    service_name,
    status,
    total_amount,
    quotation_amount,
    quotation_details,
    quotation_status,
    quotation_provided_at
FROM bookings 
WHERE booking_number = '20250131-00001';  -- Replace with your actual booking number
