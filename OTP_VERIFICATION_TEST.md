# OTP Verification Test Guide

## ✅ Frontend Implementation Status

The OTP verification system is **FULLY IMPLEMENTED** for both mobile number and email changes in the frontend.

### 🔍 How to Test:

#### **Phone Number OTP Verification:**
1. **Login** with Google or any account
2. **Go to Profile** settings page
3. **Change the phone number** to a different number
4. **Click Save** button
5. **OTP Modal appears** with:
   - Title: "Verify Phone Number"
   - Message: "We've sent an OTP to [masked phone number]"
   - Input field for 6-digit OTP
   - Verify and Cancel buttons

#### **Email OTP Verification:**
1. **Login** with Google or any account
2. **Go to Profile** settings page
3. **Change the email address** to a different email
4. **Click Save** button
5. **OTP Modal appears** with:
   - Title: "Verify Email Address"
   - Message: "We've sent an OTP to [masked email]"
   - Input field for 6-digit OTP
   - Verify and Cancel buttons

### 📱 Frontend Features Working:

#### **Dynamic OTP Modal:**
- ✅ **Phone verification**: Shows "Verify Phone Number" title
- ✅ **Email verification**: Shows "Verify Email Address" title
- ✅ **Dynamic message**: Shows correct contact method (phone/email)
- ✅ **Masked display**: Phone shows `****1234`, Email shows `as***i@gmail.com`

#### **Validation Logic:**
- ✅ **Change detection**: Compares original vs new values
- ✅ **Duplicate prevention**: Checks if phone/email already exists
- ✅ **OTP requirement**: Forces verification before saving
- ✅ **Error handling**: Shows clear error messages

#### **User Experience:**
- ✅ **Professional modal**: Clean, responsive design
- ✅ **Clear instructions**: User knows exactly what to do
- ✅ **Loading states**: Shows "Verifying..." during process
- ✅ **Error display**: Red banner for errors with dismiss button

### 🔧 Backend Endpoints Available:

#### **Phone Verification:**
- `GET /api/user/check-phone/{phoneNumber}` - Check if phone exists
- `POST /api/user/send-otp` - Send SMS OTP
- `POST /api/user/verify-otp` - Verify phone OTP

#### **Email Verification:**
- `GET /api/user/check-email/{email}` - Check if email exists
- `POST /api/user/send-email-otp` - Send email OTP
- `POST /api/user/verify-email-otp` - Verify email OTP

### 🎯 Test Scenarios:

#### **Scenario 1: Phone Number Change**
```
1. User changes phone from "8357028350" to "9876543210"
2. Click Save → OTP modal appears
3. Title: "Verify Phone Number"
4. Message: "We've sent an OTP to ****3210"
5. Enter OTP → Profile saved successfully
```

#### **Scenario 2: Email Change**
```
1. User changes email from "old@gmail.com" to "new@gmail.com"
2. Click Save → OTP modal appears
3. Title: "Verify Email Address"
4. Message: "We've sent an OTP to ne***w@gmail.com"
5. Enter OTP → Profile saved successfully
```

#### **Scenario 3: Both Changes**
```
1. User changes both phone AND email
2. Click Save → Phone OTP modal appears first
3. Verify phone → Email OTP modal appears
4. Verify email → Profile saved with both changes
```

### 🚀 Development Mode Features:

- **OTP in Console**: For testing, OTP is logged to browser console
- **Mock Services**: Works even without SMS/Email services configured
- **Debug Logging**: Comprehensive logging for troubleshooting

### 📋 Verification Checklist:

- [x] Phone OTP modal shows correctly
- [x] Email OTP modal shows correctly
- [x] Dynamic titles and messages work
- [x] Contact masking works (phone/email)
- [x] Duplicate checking prevents conflicts
- [x] Error handling shows clear messages
- [x] Loading states work properly
- [x] Cancel functionality works
- [x] OTP verification completes successfully
- [x] Profile saves after verification

## 🎉 Result: **FULLY FUNCTIONAL**

The OTP verification system is completely implemented and working for both phone number and email changes on the frontend. Users will see appropriate verification modals based on what they're changing, with clear instructions and professional UI.
