-- Create payments table with foreign key reference to bookings
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Key to bookings table
    booking_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Payment Amount Details
    subtotal DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) DEFAULT 0.00,
    gst_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    promo_code VARCHAR(50),
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Payment Method & Gateway
    payment_method VARCHAR(50) NOT NULL,
    payment_gateway VARCHAR(50),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    
    -- Transaction Details
    transaction_id VARCHAR(100),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    
    -- Payment Timestamps
    payment_initiated_at DATETIME,
    payment_completed_at DATETIME,
    payment_failed_at DATETIME,
    failure_reason TEXT,
    
    -- Refund Details
    refund_amount DECIMAL(10, 2),
    refund_status VARCHAR(50),
    refund_initiated_at DATETIME,
    refund_completed_at DATETIME,
    refund_transaction_id VARCHAR(100),
    refund_reason TEXT,
    
    -- Customer Details (denormalized)
    customer_name VARCHAR(200),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(15),
    
    -- Additional Info
    payment_description TEXT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    notes TEXT,
    
    -- Timestamps
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraint
    CONSTRAINT fk_payments_booking 
        FOREIGN KEY (booking_id) 
        REFERENCES bookings(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    -- Indexes for better query performance
    INDEX idx_booking_id (booking_id),
    INDEX idx_user_id (user_id),
    INDEX idx_payment_number (payment_number),
    INDEX idx_payment_status (payment_status),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_razorpay_order_id (razorpay_order_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment to table
ALTER TABLE payments COMMENT = 'Stores all payment transactions with reference to bookings';

-- Sample query to verify the relationship
-- SELECT b.booking_number, b.service_name, p.payment_number, p.total_amount, p.payment_status
-- FROM bookings b
-- LEFT JOIN payments p ON b.id = p.booking_id
-- WHERE b.user_id = ?;
