# Payment System Implementation Guide

## Overview
This document describes the new payment tracking system with a dedicated `payments` table that references the `bookings` table via foreign key.

## Database Schema

### Payments Table Structure

```sql
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Key Reference
    booking_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Amount Breakdown
    subtotal DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) DEFAULT 0.00,
    gst_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    promo_code VARCHAR(50),
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Payment Details
    payment_method VARCHAR(50) NOT NULL,
    payment_gateway VARCHAR(50),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    
    -- Transaction IDs
    transaction_id VARCHAR(100),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    
    -- Timestamps
    payment_initiated_at DATETIME,
    payment_completed_at DATETIME,
    payment_failed_at DATETIME,
    
    -- Refund Support
    refund_amount DECIMAL(10, 2),
    refund_status VARCHAR(50),
    refund_initiated_at DATETIME,
    refund_completed_at DATETIME,
    
    -- Foreign Key Constraint
    CONSTRAINT fk_payments_booking 
        FOREIGN KEY (booking_id) 
        REFERENCES bookings(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);
```

## Relationship Diagram

```
┌─────────────────┐         ┌──────────────────┐
│   bookings      │         │    payments      │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │◄────────│ booking_id (FK)  │
│ booking_number  │         │ payment_number   │
│ user_id         │         │ total_amount     │
│ service_name    │         │ payment_status   │
│ status          │         │ transaction_id   │
│ payment_status  │         │ razorpay_*       │
│ ...             │         │ ...              │
└─────────────────┘         └──────────────────┘
     1                              *
  (One booking can have multiple payment attempts)
```

## Payment Status Flow

```
PENDING → PROCESSING → COMPLETED
   ↓
FAILED
   ↓
CANCELLED

COMPLETED → REFUNDED (if refund requested)
```

## Implementation Steps

### 1. Run SQL Migration

```bash
mysql -u root -p needstation < create_payments_table.sql
```

### 2. Java Entity Created

- **File**: `Payment.java`
- **Location**: `src/main/java/com/example/authbackend/model/`
- **Features**:
  - Foreign key to `BookingNew`
  - Complete payment tracking
  - Refund support
  - Razorpay integration fields

### 3. Repository Created

- **File**: `PaymentRepository.java`
- **Location**: `src/main/java/com/example/authbackend/repository/`
- **Key Methods**:
  - `findByBookingId(Long bookingId)`
  - `findByPaymentNumber(String paymentNumber)`
  - `findByRazorpayOrderId(String orderId)`
  - `hasSuccessfulPayment(Long bookingId)`
  - `getTotalRevenue()`

### 4. DTO Created

- **File**: `PaymentResponseDTO.java`
- **Location**: `src/main/java/com/example/authbackend/dto/`

## Usage Examples

### Creating a Payment Record

```java
Payment payment = new Payment();
payment.setBookingId(booking.getId());
payment.setUserId(booking.getUserId());
payment.setPaymentNumber("PAY-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + String.format("%05d", sequence));
payment.setSubtotal(new BigDecimal("2500.00"));
payment.setPlatformFee(new BigDecimal("49.00"));
payment.setGstAmount(new BigDecimal("459.00"));
payment.setDiscountAmount(new BigDecimal("1250.00"));
payment.setTotalAmount(new BigDecimal("1758.00"));
payment.setPaymentMethod("RAZORPAY");
payment.setPaymentStatus("PENDING");

paymentRepository.save(payment);
```

### Updating Payment on Success

```java
Payment payment = paymentRepository.findByRazorpayOrderId(orderId)
    .orElseThrow(() -> new RuntimeException("Payment not found"));

payment.setPaymentStatus("COMPLETED");
payment.setRazorpayPaymentId(paymentId);
payment.setRazorpaySignature(signature);
payment.setTransactionId(paymentId);
payment.setPaymentCompletedAt(LocalDateTime.now());

paymentRepository.save(payment);

// Also update booking status
booking.setPaymentStatus("PAID");
booking.setStatus("PAYMENT_COMPLETED");
bookingRepository.save(booking);
```

### Querying Payments

```java
// Get all payments for a user
List<Payment> userPayments = paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);

// Check if booking is paid
boolean isPaid = paymentRepository.hasSuccessfulPayment(bookingId);

// Get payment by booking
Optional<Payment> payment = paymentRepository.findByBookingId(bookingId);

// Get total revenue
Double totalRevenue = paymentRepository.getTotalRevenue();
```

## Benefits of Separate Payments Table

### 1. **Better Data Organization**
- Clean separation of booking and payment data
- Easier to track payment history

### 2. **Multiple Payment Attempts**
- Track failed payment attempts
- Retry logic support
- Payment audit trail

### 3. **Refund Management**
- Dedicated refund fields
- Partial/full refund tracking
- Refund history

### 4. **Analytics & Reporting**
- Revenue tracking
- Payment success rate
- Gateway performance
- Refund statistics

### 5. **Scalability**
- Can support multiple payment gateways
- Easy to add new payment methods
- Better query performance with indexes

### 6. **Compliance**
- Payment audit trail
- Transaction history
- Regulatory compliance

## Payment Number Format

```
PAY-YYYYMMDD-XXXXX

Example: PAY-20251031-00001
```

## Integration with Razorpay

### Fields Mapped:
- `razorpay_order_id` → Order created in Razorpay
- `razorpay_payment_id` → Payment ID after success
- `razorpay_signature` → Signature for verification
- `transaction_id` → Same as razorpay_payment_id

### Verification Flow:
1. Create Razorpay order → Store `razorpay_order_id`
2. User pays → Receive `razorpay_payment_id` and `razorpay_signature`
3. Verify signature
4. Update payment status to COMPLETED
5. Update booking status to PAYMENT_COMPLETED

## Next Steps

1. **Create PaymentService** - Business logic for payment operations
2. **Create PaymentController** - REST endpoints for payment APIs
3. **Update BookingService** - Integrate with PaymentService
4. **Frontend Integration** - Update payment flow to create payment records
5. **Add Payment History Page** - Show user's payment history
6. **Add Admin Dashboard** - Payment analytics and management

## Sample Queries

### Get Payment Details with Booking Info
```sql
SELECT 
    b.booking_number,
    b.service_name,
    b.status as booking_status,
    p.payment_number,
    p.total_amount,
    p.payment_status,
    p.payment_method,
    p.payment_completed_at
FROM bookings b
LEFT JOIN payments p ON b.id = p.booking_id
WHERE b.user_id = ?
ORDER BY p.created_at DESC;
```

### Get Revenue by Date
```sql
SELECT 
    DATE(payment_completed_at) as payment_date,
    COUNT(*) as total_payments,
    SUM(total_amount) as total_revenue
FROM payments
WHERE payment_status = 'COMPLETED'
GROUP BY DATE(payment_completed_at)
ORDER BY payment_date DESC;
```

### Get Failed Payments
```sql
SELECT 
    p.payment_number,
    p.total_amount,
    p.failure_reason,
    p.payment_failed_at,
    b.booking_number,
    b.service_name
FROM payments p
JOIN bookings b ON p.booking_id = b.id
WHERE p.payment_status = 'FAILED'
ORDER BY p.payment_failed_at DESC;
```

## Migration Notes

- Existing bookings will not have payment records initially
- You can create payment records for existing paid bookings using a migration script
- The foreign key constraint ensures data integrity
- `ON DELETE RESTRICT` prevents deletion of bookings with payment records
