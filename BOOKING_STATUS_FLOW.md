# 📋 Booking Status Flow with Payment Integration

## Overview
Implemented a proper booking lifecycle where bookings are created in **DRAFT** status and only become **CONFIRMED** after payment is completed.

## 🔄 Status Flow

```
DRAFT → PAYMENT_PENDING → CONFIRMED → ASSIGNED → IN_PROGRESS → COMPLETED
                                                              ↓
                                                          CANCELLED
```

### Status Definitions

| Status | Description | Trigger |
|--------|-------------|---------|
| **DRAFT** | Booking created, awaiting payment | User completes Steps 1-3 in booking modal |
| **PAYMENT_PENDING** | Payment initiated but not confirmed | User clicks "Pay Now" |
| **CONFIRMED** | Payment successful, booking confirmed | Payment gateway callback |
| **ASSIGNED** | Worker assigned to booking | Admin assigns worker |
| **IN_PROGRESS** | Service has started | Worker marks service as started |
| **COMPLETED** | Service finished | Worker/Admin marks as complete |
| **CANCELLED** | Booking cancelled | User/Admin cancels |

## 🎯 Implementation Changes

### 1. Database Model (`BookingNew.java`)
```java
// Changed default status from "PENDING" to "DRAFT"
private String status = "DRAFT";
```

### 2. Service Layer (`BookingServiceNew.java`)
Added new method:
```java
public BookingResponseDTO confirmPayment(
    Long bookingId, 
    String paymentMethod, 
    String transactionId, 
    BigDecimal paidAmount
)
```

### 3. Controller (`BookingNewController.java`)
Added new endpoint:
```
POST /api/bookings/{bookingId}/confirm-payment
```

## 📡 API Endpoints

### Create Booking (Steps 1-3)
```http
POST /api/bookings
Content-Type: application/json

{
  "userId": 1,
  "serviceId": 3,
  "contactInfo": { ... },
  "scheduling": { ... },
  "selectedSubServices": [21, 22],
  "formalityData": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "id": 1,
    "bookingNumber": "BK-20251017-00001",
    "status": "DRAFT",
    "paymentStatus": "PENDING",
    "totalAmount": 1500.00
  }
}
```

### Confirm Payment
```http
POST /api/bookings/1/confirm-payment
Content-Type: application/json

{
  "paymentMethod": "RAZORPAY",
  "transactionId": "pay_MxYzAbC123",
  "paidAmount": 1500.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed successfully. Booking is now confirmed!",
  "booking": {
    "id": 1,
    "bookingNumber": "BK-20251017-00001",
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
    "paymentMethod": "RAZORPAY",
    "transactionId": "pay_MxYzAbC123"
  }
}
```

## 🎨 Frontend Integration

### Step 1: Create Booking (After Step 3)
```javascript
// BookingModal.jsx - handleSubmit()
const response = await createBooking(bookingData);

if (response.success) {
  const { bookingId, bookingNumber, totalAmount } = response;
  
  // Show payment page
  navigate(`/payment/${bookingId}`, {
    state: {
      bookingNumber,
      amount: totalAmount,
      serviceName
    }
  });
}
```

### Step 2: Payment Page
```javascript
// PaymentPage.jsx
const handlePayment = async () => {
  // Integrate with Razorpay/Paytm
  const paymentResult = await initiatePayment({
    amount: booking.totalAmount,
    bookingId: booking.id
  });
  
  if (paymentResult.success) {
    // Confirm payment on backend
    await confirmPayment(booking.id, {
      paymentMethod: 'RAZORPAY',
      transactionId: paymentResult.transactionId,
      paidAmount: booking.totalAmount
    });
    
    // Show success message
    navigate('/booking-success', {
      state: { bookingNumber: booking.bookingNumber }
    });
  }
};
```

### Step 3: Success Page
```javascript
// BookingSuccessPage.jsx
<div>
  <h1>✅ Booking Confirmed!</h1>
  <p>Booking Number: {bookingNumber}</p>
  <p>Status: CONFIRMED</p>
  <p>A worker will be assigned shortly.</p>
</div>
```

## 💳 Payment Integration Options

### Option 1: Razorpay (Recommended)
```javascript
const options = {
  key: 'YOUR_RAZORPAY_KEY',
  amount: booking.totalAmount * 100, // Convert to paise
  currency: 'INR',
  name: 'NeedStation',
  description: `Booking ${booking.bookingNumber}`,
  handler: function(response) {
    confirmPayment(booking.id, {
      paymentMethod: 'RAZORPAY',
      transactionId: response.razorpay_payment_id,
      paidAmount: booking.totalAmount
    });
  }
};

const rzp = new Razorpay(options);
rzp.open();
```

### Option 2: Cash on Service
```javascript
// Allow users to select "Cash on Service"
await confirmPayment(booking.id, {
  paymentMethod: 'CASH',
  transactionId: 'CASH_' + Date.now(),
  paidAmount: booking.totalAmount
});
```

## 📊 User Flow Example

### Scenario: Booking Elderly Care Service

1. **User fills booking form (Steps 1-3)**
   - Contact info
   - Service details
   - Scheduling
   - Clicks "Confirm Booking"

2. **Booking created with status: DRAFT**
   ```
   Booking Number: BK-20251017-00001
   Status: DRAFT
   Payment Status: PENDING
   ```

3. **User redirected to payment page**
   - Shows booking summary
   - Total amount: ₹1,500
   - Payment options: Razorpay, UPI, Cash

4. **User completes payment**
   - Razorpay payment successful
   - Transaction ID: pay_MxYzAbC123

5. **Backend confirms payment**
   ```
   Status: DRAFT → CONFIRMED
   Payment Status: PENDING → PAID
   ```

6. **User sees confirmation**
   - "Booking Confirmed!"
   - Booking number displayed
   - Email/SMS sent

7. **Admin assigns worker**
   ```
   Status: CONFIRMED → ASSIGNED
   ```

8. **Service day**
   ```
   Status: ASSIGNED → IN_PROGRESS → COMPLETED
   ```

## 🔍 Database Queries

### Get all draft bookings (awaiting payment)
```sql
SELECT * FROM bookings 
WHERE status = 'DRAFT' 
AND deleted_at IS NULL 
ORDER BY created_at DESC;
```

### Get confirmed bookings (paid)
```sql
SELECT * FROM bookings 
WHERE status = 'CONFIRMED' 
AND payment_status = 'PAID' 
AND deleted_at IS NULL 
ORDER BY preferred_date, preferred_time;
```

### Get bookings needing worker assignment
```sql
SELECT * FROM bookings 
WHERE status = 'CONFIRMED' 
AND assigned_worker_id IS NULL 
AND deleted_at IS NULL 
ORDER BY urgency DESC, preferred_date;
```

## 🎯 Benefits

1. **Clear separation** between booking creation and confirmation
2. **Payment tracking** - Know which bookings are paid
3. **Better UX** - Users understand the process
4. **Admin visibility** - Easy to see which bookings need attention
5. **Revenue tracking** - Track paid vs unpaid bookings

## ⚠️ Important Notes

1. **DRAFT bookings** should be auto-cancelled after 30 minutes if payment not completed
2. **Payment webhooks** should be implemented for automatic confirmation
3. **Email/SMS notifications** should be sent at each status change
4. **Refund handling** should update status to CANCELLED and payment_status to REFUNDED

## 🚀 Next Steps

1. **Restart backend** to apply changes
2. **Update frontend** to show payment page after booking creation
3. **Integrate payment gateway** (Razorpay/Paytm)
4. **Add status badges** in booking list (Draft, Confirmed, etc.)
5. **Implement auto-cancellation** for unpaid bookings

---

**Status**: ✅ Backend implementation complete
**Next**: Frontend payment page integration

