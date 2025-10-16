# Booking Error Troubleshooting Guide

## 🚨 Current Error

**Error:** 500 Internal Server Error when creating booking
**Location:** `POST /api/bookings`
**Frontend Error:** "An error occurred while processing your request"

## 🔍 Changes Made to Debug

### 1. Enhanced Frontend Logging
**File:** `bookingApi.js`

Added detailed console logging:
- Request URL and payload
- Response status and data
- Better error messages with actual server response

### 2. Improved Backend Error Handling
**File:** `BookingServiceNew.java`

Added:
- Try-catch block around entire booking creation
- Console logging at each step
- Better error messages with context
- Null-safe user name handling (fallback to username if fullName is null)

### 3. User Name Null Safety
**Issue:** User's `fullName` might be null
**Fix:** Added fallback logic:
```java
String userName = user.getFullName();
if (userName == null || userName.trim().isEmpty()) {
    userName = user.getUsername();
}
booking.setUserName(userName);
```

## 🧪 How to Debug

### Step 1: Check Backend Console
When you submit a booking, look for these logs in backend console:

```
📝 Creating booking for userId: X, serviceId: Y
✅ Service found: [Service Name]
✅ User found: [Username]
✅ Total amount calculated: [Amount]
✅ Booking created successfully: BK20251016001
```

**OR if error:**
```
❌ Error creating booking: [Error Message]
[Stack Trace]
```

### Step 2: Check Frontend Console
Look for these logs in browser console:

```
📤 Sending booking request to: http://localhost:8080/api/bookings
📦 Booking data: { ... }
📥 Response status: 500
📥 Response data: { success: false, message: "..." }
❌ Error creating booking: ...
```

### Step 3: Common Issues to Check

#### Issue 1: User Not Found
**Error:** "User not found with ID: X"
**Solution:** 
- Check if user exists: `SELECT * FROM users WHERE id = X;`
- Verify userId is being sent correctly from frontend
- Check localStorage: `localStorage.getItem('userId')`

#### Issue 2: Service Not Found
**Error:** "Service not found with ID: X"
**Solution:**
- Check if service exists: `SELECT * FROM services WHERE id = X;`
- Verify serviceId is being fetched from API config
- Check if `apiServiceConfig?.service?.id` is populated

#### Issue 3: Database Connection
**Error:** "Could not open JPA EntityManager for transaction"
**Solution:**
- Check if MySQL is running
- Verify database credentials in `application.properties`
- Test connection: `mysql -u username -p needstation`

#### Issue 4: Missing Required Fields
**Error:** "Column 'X' cannot be null"
**Solution:**
- Check which field is null in the error message
- Verify frontend is sending all required fields
- Check DTO validation

#### Issue 5: Trigger Issues
**Error:** "Error in trigger"
**Solution:**
- Check if triggers are created: `SHOW TRIGGERS;`
- Verify trigger syntax is correct
- Check trigger execution logs

## 📋 Testing Checklist

### Before Submitting Booking:

1. **Backend Running?**
   ```bash
   # Should see: Started AuthbackendApplication
   mvn spring-boot:run
   ```

2. **Database Connected?**
   ```sql
   -- Should return services
   SELECT * FROM services LIMIT 5;
   ```

3. **User Exists?**
   ```sql
   -- Replace X with your userId
   SELECT id, username, email, full_name FROM users WHERE id = X;
   ```

4. **Service Config Loaded?**
   - Open browser console
   - Look for: "✅ Service config loaded: {...}"
   - Check: `apiServiceConfig?.service?.id` is not null

5. **Form Data Valid?**
   - Phone number filled
   - Location selected
   - Address filled
   - Date selected

### After Submitting Booking:

1. **Check Backend Console** for error logs
2. **Check Frontend Console** for request/response details
3. **Check Database** for created booking:
   ```sql
   SELECT * FROM bookings ORDER BY id DESC LIMIT 1;
   ```

## 🔧 Quick Fixes

### Fix 1: Restart Backend
```bash
# Stop current process (Ctrl+C)
# Restart
mvn spring-boot:run
```

### Fix 2: Clear Frontend Cache
```javascript
// In browser console
localStorage.clear();
// Refresh page
location.reload();
```

### Fix 3: Check Database Connection
```bash
# Test MySQL connection
mysql -u root -p
USE needstation;
SHOW TABLES;
```

### Fix 4: Verify API Endpoint
```bash
# Test service endpoint
curl http://localhost:8080/api/services

# Should return list of services
```

## 📊 Expected Request Format

```json
{
  "userId": 1,
  "serviceId": 6,
  "contactInfo": {
    "phone": "8357028350",
    "alternatePhone": null,
    "fullAddress": "Flat 603, Indore",
    "landmark": null,
    "city": "Indore",
    "state": "Madhya Pradesh",
    "pincode": "452010",
    "locationLat": 22.7196,
    "locationLng": 75.8577,
    "locationAddress": "Flat 603, Indore"
  },
  "scheduling": {
    "preferredDate": "2025-10-20",
    "preferredTime": "10:00",
    "preferredTimeSlot": "Morning",
    "urgency": "NORMAL"
  },
  "selectedSubServices": [22, 23],
  "formalityData": {
    "patient_age": "75",
    "medical_conditions": "Diabetes"
  },
  "specialInstructions": null
}
```

## 📊 Expected Response Format

```json
{
  "success": true,
  "message": "Booking created successfully",
  "bookingNumber": "BK20251016001",
  "bookingId": 123,
  "booking": {
    "id": 123,
    "bookingNumber": "BK20251016001",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "totalAmount": 1250.00,
    "serviceName": "Elderly Care",
    "userName": "John Doe",
    "phone": "8357028350",
    "subServices": ["Medication Management", "Meal Preparation"],
    "subservicesCount": 2,
    "formalityData": {
      "patient_age": "75",
      "medical_conditions": "Diabetes"
    }
  }
}
```

## 🆘 Still Getting Error?

### Get Detailed Error Info:

1. **Backend Console:** Copy the full stack trace
2. **Frontend Console:** Copy the request payload and response
3. **Database:** Check for any constraint violations:
   ```sql
   SHOW ENGINE INNODB STATUS;
   ```

### Common Error Patterns:

| Error Message | Likely Cause | Solution |
|--------------|--------------|----------|
| "User not found" | Invalid userId | Check user exists in DB |
| "Service not found" | Invalid serviceId | Verify service config loaded |
| "Cannot be null" | Missing required field | Check frontend form data |
| "Duplicate entry" | Unique constraint violation | Check for existing records |
| "Foreign key constraint" | Referenced record missing | Verify related data exists |

---

**Next Steps:**
1. Try submitting a booking again
2. Check backend console for detailed logs
3. Check frontend console for request/response
4. Share the error messages for further debugging

**Last Updated:** October 16, 2025
