-- Migration V13: Create optimized views for easy querying
-- Purpose: Make it easy for DB admins and reports to query booking data

-- View 1: Booking List (for dashboards and listing pages)
CREATE OR REPLACE VIEW v_booking_list AS
SELECT 
    b.id,
    b.booking_number,
    b.user_id,
    b.user_name,
    b.user_email,
    b.phone,
    b.service_id,
    b.service_name,
    b.service_code,
    b.status,
    b.payment_status,
    b.preferred_date,
    b.preferred_time_slot,
    b.urgency,
    b.total_amount,
    b.subservices_count,
    b.assigned_worker_id,
    b.assigned_worker_name,
    b.customer_rating,
    b.created_at,
    b.updated_at,
    b.completed_at,
    -- Calculated fields
    DATEDIFF(b.preferred_date, CURDATE()) as days_until_service,
    CASE 
        WHEN b.status = 'COMPLETED' THEN 'Completed'
        WHEN b.status = 'CANCELLED' THEN 'Cancelled'
        WHEN b.preferred_date < CURDATE() THEN 'Overdue'
        WHEN b.preferred_date = CURDATE() THEN 'Today'
        WHEN b.preferred_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY) THEN 'Tomorrow'
        ELSE 'Upcoming'
    END as service_status_label
FROM bookings b
WHERE b.deleted_at IS NULL;

-- View 2: Booking Details (complete information for single booking)
CREATE OR REPLACE VIEW v_booking_details AS
SELECT 
    b.*,
    -- Service details
    s.description as service_description,
    s.base_price as service_base_price,
    -- User details
    u.contact_number as user_contact,
    u.alternate_contact as user_alternate_contact,
    -- Worker details (if assigned)
    w.full_name as worker_full_name,
    w.contact_number as worker_contact,
    w.rating as worker_rating,
    -- Aggregated subservices
    GROUP_CONCAT(DISTINCT bss.sub_service_name ORDER BY bss.sub_service_name SEPARATOR ', ') as subservices_list,
    -- Count of formality responses
    COUNT(DISTINCT bfd.id) as formality_responses_count
FROM bookings b
LEFT JOIN services s ON b.service_id = s.id
LEFT JOIN users u ON b.user_id = u.id
LEFT JOIN workers w ON b.assigned_worker_id = w.id
LEFT JOIN booking_sub_services bss ON b.id = bss.booking_id
LEFT JOIN booking_formality_data bfd ON b.id = bfd.booking_id
WHERE b.deleted_at IS NULL
GROUP BY b.id;

-- View 3: Today's Bookings (for daily operations)
CREATE OR REPLACE VIEW v_todays_bookings AS
SELECT 
    b.id,
    b.booking_number,
    b.user_name,
    b.phone,
    b.service_name,
    b.status,
    b.preferred_time,
    b.preferred_time_slot,
    b.full_address,
    b.city,
    b.assigned_worker_name,
    b.urgency,
    b.total_amount,
    b.special_instructions
FROM bookings b
WHERE b.preferred_date = CURDATE()
  AND b.status NOT IN ('CANCELLED', 'COMPLETED')
  AND b.deleted_at IS NULL
ORDER BY 
    CASE b.urgency
        WHEN 'EMERGENCY' THEN 1
        WHEN 'URGENT' THEN 2
        ELSE 3
    END,
    b.preferred_time;

-- View 4: Pending Bookings (need action)
CREATE OR REPLACE VIEW v_pending_bookings AS
SELECT 
    b.id,
    b.booking_number,
    b.user_name,
    b.phone,
    b.service_name,
    b.preferred_date,
    b.preferred_time_slot,
    b.urgency,
    b.total_amount,
    b.created_at,
    TIMESTAMPDIFF(HOUR, b.created_at, NOW()) as hours_since_booking
FROM bookings b
WHERE b.status = 'PENDING'
  AND b.deleted_at IS NULL
ORDER BY 
    CASE b.urgency
        WHEN 'EMERGENCY' THEN 1
        WHEN 'URGENT' THEN 2
        ELSE 3
    END,
    b.created_at;

-- View 5: User Booking History
CREATE OR REPLACE VIEW v_user_booking_history AS
SELECT 
    b.user_id,
    b.user_name,
    b.id as booking_id,
    b.booking_number,
    b.service_name,
    b.status,
    b.preferred_date,
    b.total_amount,
    b.payment_status,
    b.customer_rating,
    b.created_at,
    b.completed_at
FROM bookings b
WHERE b.deleted_at IS NULL
ORDER BY b.user_id, b.created_at DESC;

-- View 6: Service Statistics (for analytics)
CREATE OR REPLACE VIEW v_service_statistics AS
SELECT 
    s.id as service_id,
    s.service_name,
    s.service_code,
    COUNT(b.id) as total_bookings,
    COUNT(CASE WHEN b.status = 'COMPLETED' THEN 1 END) as completed_bookings,
    COUNT(CASE WHEN b.status = 'CANCELLED' THEN 1 END) as cancelled_bookings,
    COUNT(CASE WHEN b.status = 'PENDING' THEN 1 END) as pending_bookings,
    AVG(b.total_amount) as avg_booking_amount,
    SUM(b.total_amount) as total_revenue,
    AVG(b.customer_rating) as avg_rating,
    COUNT(CASE WHEN b.customer_rating >= 4 THEN 1 END) * 100.0 / NULLIF(COUNT(b.customer_rating), 0) as satisfaction_rate
FROM services s
LEFT JOIN bookings b ON s.id = b.service_id AND b.deleted_at IS NULL
WHERE s.deleted_at IS NULL
GROUP BY s.id, s.service_name, s.service_code;

-- View 7: Worker Performance (for worker management)
CREATE OR REPLACE VIEW v_worker_performance AS
SELECT 
    w.id as worker_id,
    w.full_name as worker_name,
    w.contact_number,
    COUNT(b.id) as total_assignments,
    COUNT(CASE WHEN b.status = 'COMPLETED' THEN 1 END) as completed_assignments,
    COUNT(CASE WHEN b.status = 'IN_PROGRESS' THEN 1 END) as ongoing_assignments,
    AVG(b.customer_rating) as avg_customer_rating,
    SUM(b.total_amount) as total_revenue_generated,
    MAX(b.completed_at) as last_completed_service
FROM workers w
LEFT JOIN bookings b ON w.id = b.assigned_worker_id AND b.deleted_at IS NULL
GROUP BY w.id, w.full_name, w.contact_number;

-- View 8: Daily Revenue Report
CREATE OR REPLACE VIEW v_daily_revenue AS
SELECT 
    DATE(b.created_at) as booking_date,
    COUNT(b.id) as total_bookings,
    SUM(b.total_amount) as total_revenue,
    SUM(CASE WHEN b.payment_status = 'PAID' THEN b.total_amount ELSE 0 END) as paid_amount,
    SUM(CASE WHEN b.payment_status = 'PENDING' THEN b.total_amount ELSE 0 END) as pending_amount,
    AVG(b.total_amount) as avg_booking_value
FROM bookings b
WHERE b.deleted_at IS NULL
  AND b.status != 'CANCELLED'
GROUP BY DATE(b.created_at)
ORDER BY booking_date DESC;

-- View 9: Booking Formality Responses (for detailed view)
CREATE OR REPLACE VIEW v_booking_formality_responses AS
SELECT 
    bfd.booking_id,
    b.booking_number,
    bfd.field_name,
    bfd.field_label,
    bfd.field_value,
    sf.field_type,
    sf.formality_type
FROM booking_formality_data bfd
JOIN bookings b ON bfd.booking_id = b.id
JOIN service_formalities sf ON bfd.formality_id = sf.id
WHERE b.deleted_at IS NULL
ORDER BY bfd.booking_id, sf.display_order;

-- View 10: Upcoming Services (next 7 days)
CREATE OR REPLACE VIEW v_upcoming_services AS
SELECT 
    b.id,
    b.booking_number,
    b.user_name,
    b.phone,
    b.service_name,
    b.preferred_date,
    b.preferred_time,
    b.preferred_time_slot,
    b.status,
    b.assigned_worker_name,
    b.full_address,
    b.city,
    b.urgency,
    DATEDIFF(b.preferred_date, CURDATE()) as days_away
FROM bookings b
WHERE b.preferred_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
  AND b.status NOT IN ('CANCELLED', 'COMPLETED')
  AND b.deleted_at IS NULL
ORDER BY b.preferred_date, b.preferred_time;
