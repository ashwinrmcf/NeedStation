# 🛒 NeedStation Cart & Payment System

## Overview
Complete cart and payment system redesigned from scratch to match NeedStation's healthcare-focused theme with Razorpay integration.

---

## ✨ Features

### **Frontend Features**
1. ✅ **Modern Healthcare Design**
   - Matches NeedStation's dark/light theme
   - Teal accent colors (#5CE1E6)
   - Clean, professional UI inspired by Urban Company
   - Fully responsive (mobile, tablet, desktop)

2. ✅ **Smart Cart Management**
   - Add/remove services
   - Quantity control
   - Real-time price calculation
   - Persistent cart (localStorage)
   - Empty cart redirect

3. ✅ **Pricing & Discounts**
   - Subtotal calculation
   - Platform fee (₹49)
   - GST (18%)
   - Promo code system
   - Savings display

4. ✅ **Payment Integration**
   - Razorpay payment gateway
   - Multiple payment methods
   - Secure payment verification
   - Payment success page

5. ✅ **User Experience**
   - Trust badges
   - Service features display
   - Smooth animations (Framer Motion)
   - Loading states
   - Error handling

---

## 📁 File Structure

```
Frontend/
├── src/pages/Cart/
│   ├── CartNew.jsx              # Main cart page
│   ├── CartNew.module.css       # Cart styling
│   ├── BookingSuccess.jsx       # Success page
│   └── BookingSuccess.module.css
│
Backend/
├── controller/
│   └── PaymentController.java   # Payment endpoints
├── service/
│   └── PaymentService.java      # Razorpay logic
└── dto/
    ├── PaymentOrderRequest.java
    └── PaymentVerificationRequest.java
```

---

## 🚀 Setup Instructions

### **1. Frontend Setup**

#### Install Dependencies
```bash
cd Frontend/Need_Station_MP-main
npm install razorpay framer-motion lucide-react
```

#### Environment Variables
Create `.env` file:
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
REACT_APP_API_URL=http://localhost:8080
```

### **2. Backend Setup**

#### Add Razorpay Dependency
Add to `pom.xml`:
```xml
<dependency>
    <groupId>com.razorpay</groupId>
    <artifactId>razorpay-java</artifactId>
    <version>1.4.3</version>
</dependency>
```

#### Configure Razorpay
Add to `application.properties`:
```properties
# Razorpay Configuration
razorpay.key.id=rzp_test_YOUR_KEY_ID
razorpay.key.secret=YOUR_KEY_SECRET
```

### **3. Get Razorpay Credentials**

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test/Live keys
4. Copy Key ID and Key Secret

---

## 🔄 User Flow

```
Services Page
    ↓
Select Service → Add to Cart
    ↓
Booking Modal (3 stages)
    ↓
Cart Page (/cart)
    ↓
Review Services
    ↓
Apply Promo Code (optional)
    ↓
Proceed to Payment (Razorpay)
    ↓
Payment Success (/booking-success)
    ↓
View Bookings (/my-bookings)
```

---

## 💳 Payment Flow

### **1. Create Order**
```javascript
POST /api/payment/create-order
{
  "amount": 5000,
  "currency": "INR",
  "receipt": "receipt_123",
  "userId": 1
}
```

### **2. Open Razorpay Checkout**
```javascript
const options = {
  key: 'rzp_test_YOUR_KEY_ID',
  amount: 5000 * 100, // paise
  currency: 'INR',
  name: 'NeedStation',
  description: 'Healthcare Services',
  order_id: orderData.orderId,
  handler: function(response) {
    // Verify payment
  }
};
```

### **3. Verify Payment**
```javascript
POST /api/payment/verify
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "userId": 1,
  "cartItems": [...],
  "amount": 5000
}
```

---

## 🎨 Design System

### **Colors**
```css
/* Dark Theme */
--bg-primary: #00071A
--bg-surface: #1C1F28
--accent-secondary: #5CE1E6 (Teal)
--accent-tertiary: #00D4AA

/* Light Theme */
--bg-primary: #F5DEB3
--bg-surface: #F8E8C8
--accent-secondary: #00D4AA
```

### **Typography**
- Font: Poppins
- Headings: 600-700 weight
- Body: 400-500 weight

---

## 🎁 Promo Codes

Built-in promo codes for testing:

| Code | Discount | Type |
|------|----------|------|
| `FIRST50` | 50% off | Percentage |
| `HEALTH100` | ₹100 off | Fixed |
| `CARE20` | 20% off | Percentage |
| `WELCOME` | ₹150 off | Fixed |

---

## 📱 Responsive Breakpoints

```css
Desktop: > 1024px
Tablet: 768px - 1024px
Mobile: < 768px
```

---

## 🔐 Security Features

1. ✅ **Payment Signature Verification**
   - HMAC SHA256 signature
   - Server-side validation
   - Prevents payment tampering

2. ✅ **User Authentication**
   - Login required for checkout
   - User ID validation
   - Secure session management

3. ✅ **Data Validation**
   - Input sanitization
   - Amount verification
   - Cart integrity checks

---

## 🧪 Testing

### **Test Cards (Razorpay Test Mode)**

```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

### **Test UPI**
```
UPI ID: success@razorpay
```

### **Test Wallets**
All wallets work in test mode

---

## 🚨 Important Notes

### **Before Going Live**

1. ✅ **Replace Test Keys**
   ```
   rzp_test_xxx → rzp_live_xxx
   ```

2. ✅ **Implement Booking Entity**
   - Create `Booking` entity
   - Save cart items as booking items
   - Store payment details
   - Update `PaymentService.saveBooking()`

3. ✅ **Add Webhooks**
   - Handle payment failures
   - Refund processing
   - Payment status updates

4. ✅ **Error Handling**
   - Payment timeout
   - Network failures
   - Invalid signatures

5. ✅ **Email Notifications**
   - Booking confirmation
   - Payment receipt
   - Service details

---

## 📊 Database Schema (TODO)

### **Booking Table**
```sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    booking_id VARCHAR(50) UNIQUE,
    total_amount DECIMAL(10,2),
    payment_id VARCHAR(100),
    payment_status VARCHAR(20),
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### **Booking Items Table**
```sql
CREATE TABLE booking_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    service_name VARCHAR(255),
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
```

---

## 🐛 Troubleshooting

### **Payment Not Working**
1. Check Razorpay keys in `.env` and `application.properties`
2. Verify backend is running on port 8080
3. Check browser console for errors
4. Ensure CORS is enabled

### **Cart Empty After Refresh**
- Cart uses localStorage
- Check browser's localStorage
- Verify CartContext is wrapping App

### **Signature Verification Failed**
- Ensure key secret matches
- Check payload format: `orderId|paymentId`
- Verify HMAC SHA256 implementation

---

## 📞 Support

For issues or questions:
1. Check console logs (frontend & backend)
2. Review Razorpay dashboard for payment logs
3. Test with provided test cards
4. Verify all environment variables

---

## 🎯 Next Steps

1. ✅ **Implement Booking Entity** - Save bookings to database
2. ✅ **Add Email Notifications** - Send confirmation emails
3. ✅ **Create Admin Panel** - Manage bookings
4. ✅ **Add Refund System** - Handle cancellations
5. ✅ **Implement Webhooks** - Real-time payment updates
6. ✅ **Add Invoice Generation** - PDF receipts
7. ✅ **Multi-language Support** - Hindi cart page

---

## 📝 License

This cart system is part of the NeedStation platform.

---

## 🙏 Credits

- **Design Inspiration**: Urban Company
- **Payment Gateway**: Razorpay
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

**Built with ❤️ for NeedStation Healthcare Platform**
