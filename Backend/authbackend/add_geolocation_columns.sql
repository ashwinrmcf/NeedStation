-- Add geolocation columns to worker table
ALTER TABLE worker 
ADD COLUMN current_latitude DOUBLE NULL AFTER service_radius_km,
ADD COLUMN current_longitude DOUBLE NULL AFTER current_latitude,
ADD COLUMN last_location_update DATETIME NULL AFTER current_longitude;
