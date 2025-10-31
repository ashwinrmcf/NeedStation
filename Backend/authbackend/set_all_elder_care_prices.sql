-- Set base prices for ALL Elder Care services
-- These will be used as automatic quotation amounts when workers accept bookings

USE needstation;

-- Update Dementia Care (id: 26)
UPDATE services 
SET base_price = 2500.00
WHERE service_name = 'Dementia Care' 
  AND category = 'Elder Care';

-- Update Companion Care (id: 24)
UPDATE services 
SET base_price = 1800.00
WHERE service_name = 'Companion Care' 
  AND category = 'Elder Care';

-- Update Respite Care (id: 25)
UPDATE services 
SET base_price = 2200.00
WHERE service_name = 'Respite Care' 
  AND category = 'Elder Care';

-- Update Personal Care (id: 23)
UPDATE services 
SET base_price = 2000.00
WHERE service_name = 'Personal Care' 
  AND category = 'Elder Care';

-- Verify the updates
SELECT 
    id,
    service_name,
    category,
    base_price
FROM services
WHERE category = 'Elder Care'
ORDER BY service_name;
