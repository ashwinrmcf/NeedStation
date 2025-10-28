-- Fix booking status from CONFIRMED to ASSIGNED
-- This updates all bookings that have a worker assigned but are still marked as CONFIRMED

UPDATE booking_new 
SET status = 'ASSIGNED' 
WHERE status = 'CONFIRMED' 
AND assigned_worker_id IS NOT NULL;

-- Verify the update
SELECT 
    id,
    booking_number,
    service_name,
    status,
    assigned_worker_id,
    assigned_worker_name,
    scheduled_at
FROM booking_new 
WHERE status = 'ASSIGNED'
ORDER BY scheduled_at DESC;
