# Automatic Quotation System

## Overview
When a worker accepts a booking, the system now **automatically** sets the quotation amount from the service's base price in the database.

## How It Works

### 1. **Service Base Prices (Database)**
```sql
-- Elder Care Services with Base Prices
┌──────────────────┬─────────────┬──────────────────────────────────┐
│ Service Name     │ Base Price  │ Price Description                │
├──────────────────┼─────────────┼──────────────────────────────────┤
│ Dementia Care    │ ₹2,500.00   │ Starting from ₹2,500 per visit   │
│ Companion Care   │ ₹1,800.00   │ Starting from ₹1,800 per visit   │
│ Respite Care     │ ₹2,200.00   │ Starting from ₹2,200 per visit   │
│ Personal Care    │ ₹2,000.00   │ Starting from ₹2,000 per visit   │
└──────────────────┴─────────────┴──────────────────────────────────┘
```

### 2. **Automatic Quotation Flow**

```
User books service
       ↓
Status: PENDING_WORKER_ASSIGNMENT
       ↓
Worker accepts booking
       ↓
Backend: WorkerDashboardService.acceptTask()
       ↓
┌─────────────────────────────────────────────┐
│ 1. Assign worker to booking                │
│ 2. Get service from database                │
│ 3. Get service.basePrice                    │
│ 4. Set booking.quotationAmount = basePrice  │
│ 5. Set booking.quotationStatus = "PROVIDED" │
│ 6. Set booking.quotationProvidedAt = NOW()  │
└─────────────────────────────────────────────┘
       ↓
Status: ASSIGNED (with quotation)
       ↓
User sees "View Quotation" button
       ↓
User accepts quotation
       ↓
User pays
```

### 3. **Code Changes**

**WorkerDashboardService.java** (Updated)
```java
public void acceptTask(Long bookingId, Long workerId) {
    // ... existing code ...
    
    // ✅ NEW: Automatically set quotation from service base price
    if (booking.getServiceId() != null) {
        Service service = serviceRepository.findById(booking.getServiceId())
                .orElse(null);
        
        if (service != null && service.getBasePrice() != null) {
            booking.setQuotationAmount(service.getBasePrice());
            booking.setQuotationDetails("Standard service quotation for " + service.getServiceName());
            booking.setQuotationStatus("PROVIDED");
            booking.setQuotationProvidedAt(LocalDateTime.now());
        }
    }
    
    bookingRepository.save(booking);
}
```

## Setup Instructions

### Step 1: Run SQL to Set Base Prices
```bash
mysql -u root -p needstation < d:\NeedStation-main\Backend\authbackend\set_all_elder_care_prices.sql
```

Or manually in MySQL:
```sql
USE needstation;

UPDATE services SET base_price = 2500.00 WHERE service_name = 'Dementia Care' AND category = 'Elder Care';
UPDATE services SET base_price = 1800.00 WHERE service_name = 'Companion Care' AND category = 'Elder Care';
UPDATE services SET base_price = 2200.00 WHERE service_name = 'Respite Care' AND category = 'Elder Care';
UPDATE services SET base_price = 2000.00 WHERE service_name = 'Personal Care' AND category = 'Elder Care';
```

### Step 2: Restart Backend
The code changes are already made. Just restart your Spring Boot application.

### Step 3: Test the Flow
1. **Book a service** (e.g., Dementia Care)
2. **Worker accepts** the booking
3. **Quotation is automatically set** to ₹2,500 (from service base price)
4. **User sees** "View Quotation" button in cart
5. **User accepts** quotation
6. **User pays** ₹2,500 (+ platform fee + GST - discount)

## Database Schema

### services table
```sql
CREATE TABLE services (
    id BIGINT PRIMARY KEY,
    service_name VARCHAR(100),
    category VARCHAR(50),
    base_price DECIMAL(10, 2),  -- ← Used for auto-quotation
    price_description VARCHAR(255),
    ...
);
```

### bookings table
```sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY,
    service_id BIGINT,  -- ← Links to services.id
    quotation_amount DECIMAL(10, 2),  -- ← Auto-set from service.base_price
    quotation_details TEXT,
    quotation_status VARCHAR(50),  -- PROVIDED, ACCEPTED, REJECTED
    quotation_provided_at DATETIME,
    ...
);
```

## Benefits

### ✅ **Automated Process**
- No manual quotation entry needed
- Worker just accepts, quotation is auto-set

### ✅ **Consistent Pricing**
- All bookings for same service get same base price
- Easy to update prices centrally in database

### ✅ **Flexible**
- Can still manually override quotation if needed
- Workers can provide custom quotations later (future feature)

### ✅ **No Frontend Changes**
- Existing cart logic works as-is
- "View Quotation" button appears automatically
- Payment flow unchanged

## Current Prices

| Service         | Base Price | Description                      |
|-----------------|------------|----------------------------------|
| Dementia Care   | ₹2,500     | Starting from ₹2,500 per visit   |
| Companion Care  | ₹1,800     | Starting from ₹1,800 per visit   |
| Respite Care    | ₹2,200     | Starting from ₹2,200 per visit   |
| Personal Care   | ₹2,000     | Starting from ₹2,000 per visit   |

## To Update Prices

Simply update the `base_price` in the `services` table:

```sql
UPDATE services 
SET base_price = 3000.00  -- New price
WHERE service_name = 'Dementia Care' 
  AND category = 'Elder Care';
```

All new bookings will automatically use the new price!

## Example Booking Flow

### Before (Manual)
```
1. User books Dementia Care
2. Worker accepts
3. Status: ASSIGNED (no quotation)
4. Admin manually adds quotation in database
5. User sees "View Quotation" button
6. User accepts and pays
```

### After (Automated) ✅
```
1. User books Dementia Care
2. Worker accepts
3. Status: ASSIGNED (quotation = ₹2,500 auto-set)
4. User sees "View Quotation" button immediately
5. User accepts and pays
```

## Verification Query

Check if quotations are being set automatically:

```sql
SELECT 
    b.id,
    b.booking_number,
    b.service_name,
    b.status,
    b.quotation_amount,
    b.quotation_status,
    b.quotation_provided_at,
    s.base_price as service_base_price
FROM bookings b
LEFT JOIN services s ON b.service_id = s.id
WHERE b.status = 'ASSIGNED'
ORDER BY b.created_at DESC
LIMIT 10;
```

Expected result:
- `quotation_amount` should match `service_base_price`
- `quotation_status` should be "PROVIDED"
- `quotation_provided_at` should be set

## Status
- ✅ SQL script created (`set_all_elder_care_prices.sql`)
- ✅ Backend code updated (`WorkerDashboardService.java`)
- ✅ No frontend changes needed
- ⚠️ **TODO**: Run SQL script to set base prices
- ⚠️ **TODO**: Restart backend application
- ⚠️ **TODO**: Test with new booking
