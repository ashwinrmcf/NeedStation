-- Add quotation columns to bookings table
ALTER TABLE bookings 
ADD COLUMN quotation_amount DECIMAL(10, 2) NULL AFTER total_amount,
ADD COLUMN quotation_details TEXT NULL AFTER quotation_amount,
ADD COLUMN quotation_provided_at DATETIME NULL AFTER quotation_details,
ADD COLUMN quotation_status VARCHAR(50) NULL AFTER quotation_provided_at;

-- Add index for quotation_status for faster queries
CREATE INDEX idx_bookings_quotation_status ON bookings(quotation_status);

-- Update existing bookings with CONFIRMED/ASSIGNED status to have PENDING quotation status
UPDATE bookings 
SET quotation_status = 'PENDING' 
WHERE status IN ('CONFIRMED', 'ASSIGNED') 
AND quotation_status IS NULL;
