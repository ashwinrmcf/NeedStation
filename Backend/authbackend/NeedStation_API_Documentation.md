# NeedStation Backend API Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:8080`  
**Date:** January 2025

---

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Google OAuth APIs](#google-oauth-apis)
3. [Signup Flow APIs](#signup-flow-apis)
4. [Worker Management APIs](#worker-management-apis)
5. [OTP & SMS APIs](#otp--sms-apis)
6. [Utility & Service APIs](#utility--service-apis)
7. [Response Format](#response-format)
8. [Error Codes](#error-codes)

---

## Authentication APIs

**Base URL:** `/api/auth`

### 1. User Registration
- **Endpoint:** `POST /api/auth/registerUser`
- **Description:** Register a new user account
- **Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com", 
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```
- **Response:**
```json
{
  "statusCode": 200,
  "message": "User registered successfully",
  "userDto": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token_here",
  "role": "USER"
}
```

### 2. User Login
- **Endpoint:** `POST /api/auth/loginUser`
- **Description:** Authenticate existing user
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. OTP Verification
- **Endpoint:** `POST /api/auth/verifyOtp`
- **Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### 4. Email OTP Verification
- **Endpoint:** `POST /api/auth/verifyEmailOtp`
- **Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### 5. Get User by ID
- **Endpoint:** `GET /api/auth/getUser/{userId}`
- **Description:** Retrieve user details by ID

### 6. Get All Users
- **Endpoint:** `GET /api/auth/getAllUsers`
- **Description:** Retrieve all registered users

### 7. Delete User
- **Endpoint:** `DELETE /api/auth/deleteUser/{userId}`
- **Description:** Delete user account

### 8. Update User Location
- **Endpoint:** `POST /api/auth/user/update-location`
- **Request Body:**
```json
{
  "userIdentifier": "1",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "address": "Bangalore, Karnataka"
}
```

### 9. Update User Form Data
- **Endpoint:** `POST /api/auth/user/update-form-data`
- **Request Body:**
```json
{
  "userIdentifier": "1",
  "address": "123 Main St",
  "landmark": "Near Park",
  "pincode": "560001",
  "contactNumber": "+919876543210",
  "alternateContact": "+919876543211",
  "preferredDate": "2025-01-15",
  "preferredTime": "10:00 AM",
  "workDetails": "Plumbing work required"
}
```

---

## Google OAuth APIs

**Base URL:** `/api/auth`

### 1. Google Authentication
- **Endpoint:** `POST /api/auth/google`
- **Description:** Authenticate user with Google OAuth
- **Request Body:**
```json
{
  "idToken": "google_id_token_here",
  "email": "user@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "name": "John Doe",
  "picture": "profile_image_url"
}
```

### 2. Google Token Verification
- **Endpoint:** `POST /api/auth/google/verify?idToken=google_id_token_here`
- **Description:** Verify Google ID token

### 3. Google Login
- **Endpoint:** `POST /api/auth/google/login`
- **Description:** Login existing user with Google
- **Request Body:** Same as Google Authentication

### 4. Google Signup
- **Endpoint:** `POST /api/auth/google/signup?idToken=google_id_token_here`
- **Description:** Signup new user with Google

### 5. Google Auth Status
- **Endpoint:** `GET /api/auth/google/status`
- **Description:** Check Google authentication service status

---

## Signup Flow APIs

**Base URL:** `/api/auth`

### 1. Signup Step 1 - Send OTP
- **Endpoint:** `POST /api/auth/signup/step1`
- **Description:** Send OTP to email for signup verification
- **Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Verify Signup OTP
- **Endpoint:** `POST /api/auth/signup/verify-otp`
- **Description:** Verify OTP sent during signup
- **Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### 3. Signup Step 2 - Complete Registration
- **Endpoint:** `POST /api/auth/signup/step2`
- **Description:** Complete user registration with password
- **Request Body:**
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 4. Resend Signup OTP
- **Endpoint:** `POST /api/auth/signup/resend-otp?email=user@example.com`
- **Description:** Resend OTP for signup verification

---

## Worker Management APIs

**Base URL:** `/api/workers`

### 1. Worker Authentication
- **Endpoint:** `POST /api/workers/authenticate?email=worker@example.com&phone=+919876543210`
- **Description:** Authenticate worker with email and phone

### 2. Worker Registration
- **Endpoint:** `POST /api/workers/registerWorker`
- **Description:** Register a new worker
- **Request Body:**
```json
{
  "fullName": "John Worker",
  "gender": "Male",
  "dob": "1990-01-01",
  "phone": "+919876543210",
  "email": "worker@example.com",
  "whatsappNumber": "+919876543210",
  "profileImageUrl": "https://example.com/profile.jpg",
  "status": "ACTIVE"
}
```

### 3. Get Worker by ID
- **Endpoint:** `GET /api/workers/getWorker/{workerId}`
- **Description:** Retrieve worker details by ID

### 4. Get All Workers
- **Endpoint:** `GET /api/workers/getAllWorkers`
- **Description:** Retrieve all registered workers

### 5. Delete Worker
- **Endpoint:** `DELETE /api/workers/deleteWorker/{workerId}`
- **Description:** Delete worker account

### 6. Generate Worker OTP
- **Endpoint:** `POST /api/workers/otp/generate/{workerId}`
- **Description:** Generate OTP for worker verification

### 7. Verify Worker OTP
- **Endpoint:** `POST /api/workers/otp/verify/{workerId}`
- **Description:** Verify worker OTP
- **Request Body:**
```json
{
  "email": "worker@example.com",
  "otp": "123456"
}
```

### 8. Check Worker Verification Status
- **Endpoint:** `GET /api/workers/otp/status/{workerId}`
- **Description:** Check worker verification status

---

## OTP & SMS APIs

**Base URL:** `/api/free-otp`

### 1. Get Phone Number for Country
- **Endpoint:** `GET /api/free-otp/phone/{country}`
- **Description:** Get available phone number for specified country
- **Example:** `GET /api/free-otp/phone/in`

### 2. Listen for OTP Messages
- **Endpoint:** `GET /api/free-otp/listen/{phoneNumber}`
- **Description:** Listen for OTP messages on specified phone number
- **Query Parameters:**
  - `matcher` (optional): Regex pattern to match in SMS
  - `timeoutSeconds` (optional): Timeout in seconds (default 60)
- **Example:** `GET /api/free-otp/listen/919876543210?matcher=\\d{6}&timeoutSeconds=120`

### 3. Check Free OTP Service Status
- **Endpoint:** `GET /api/free-otp/status`
- **Description:** Check if free OTP service is working

---

## Utility & Service APIs

**Base URL:** `/api`

### 1. Chatbot Service
- **Endpoint:** `POST /api/chatbot?message=How can I book a service?`
- **Description:** Get chatbot response for user query
- **Response:**
```json
{
  "statusCode": 200,
  "message": "Chatbot response generated",
  "chatbotResponseDto": {
    "message": "You can book a service by...",
    "type": "informational",
    "intent": "booking_help",
    "action": "show_booking_form",
    "redirectUrl": "/booking"
  }
}
```

### 2. Contact Form Submission
- **Endpoint:** `POST /api/contact/submitContact`
- **Description:** Submit contact form inquiry
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "subject": "Service Inquiry",
  "message": "I need plumbing services",
  "serviceType": "plumbing",
  "urgency": "medium"
}
```

### 3. Batch Translation
- **Endpoint:** `POST /api/translate/batch`
- **Description:** Translate multiple texts to target language
- **Request Body:**
```json
{
  "texts": ["Hello", "How are you?"],
  "targetLanguage": "hi",
  "sourceLanguage": "en"
}
```
- **Response:**
```json
{
  "statusCode": 200,
  "message": "Translation completed",
  "translateResponseDto": {
    "translatedTexts": ["नमस्ते", "आप कैसे हैं?"],
    "sourceLanguage": "en",
    "targetLanguage": "hi"
  }
}
```

---

## Response Format

All APIs return a unified `Response` object with the following structure:

```json
{
  "statusCode": 200,
  "message": "Success message",
  "userDto": {...},                    // For user-related responses
  "workerDto": {...},                  // For worker-related responses
  "chatbotResponseDto": {...},         // For chatbot responses
  "translateResponseDto": {...},       // For translation responses
  "emailOtpResponseDto": {...},        // For email OTP responses
  "googleAuthRequestDto": {...},       // For Google auth responses
  "contactDto": {...},                 // For contact responses
  "token": "jwt_token_here",           // For authentication responses
  "role": "USER",                      // User role
  "expirationTime": "2025-01-15T10:30:00Z",  // Token expiration
  "otpId": "otp_identifier"            // OTP identifier
}
```

### Response Fields Description

- **statusCode**: HTTP status code (200, 400, 404, 500)
- **message**: Descriptive message about the operation
- **userDto**: User data for authentication/user operations
- **workerDto**: Worker data for worker operations
- **chatbotResponseDto**: Chatbot response with intent and actions
- **translateResponseDto**: Translation results
- **emailOtpResponseDto**: Email OTP verification data
- **token**: JWT token for authenticated sessions
- **role**: User role (USER, ADMIN, WORKER)

---

## Error Codes

### HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| **200** | Success | Operation completed successfully |
| **400** | Bad Request | Invalid request data or validation errors |
| **404** | Not Found | Resource not found |
| **500** | Internal Server Error | Server-side error |

### Common Error Responses

**Validation Error (400):**
```json
{
  "statusCode": 400,
  "message": "Validation failed: Email is required"
}
```

**Not Found Error (404):**
```json
{
  "statusCode": 404,
  "message": "User not found with ID: 123"
}
```

**Server Error (500):**
```json
{
  "statusCode": 500,
  "message": "Internal server error: Database connection failed"
}
```

---

## CORS Configuration

All endpoints support CORS for the following origins:
- `http://localhost:3000` (React development)
- `http://localhost:5173` (Vite development)
- `http://localhost:5174` (Vite alternate port)
- `*` (All origins for development - should be restricted in production)

---

## Authentication

### JWT Token Usage

For authenticated endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

### Token Expiration

JWT tokens have an expiration time included in the response. Refresh tokens before expiration to maintain session.

---

## Rate Limiting

The API implements rate limiting for:
- OTP generation: Limited by phone number and IP address
- SMS sending: Provider-specific limits
- Authentication attempts: Limited by IP address

---

## Environment Configuration

### Required Environment Variables

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/NeedStation
spring.datasource.username=root
spring.datasource.password=your_password

# API Keys (Replace with actual values)
sendgrid.api.key=YOUR_SENDGRID_API_KEY
termii.api.key=YOUR_TERMII_API_KEY
fast2sms.api.key=YOUR_FAST2SMS_API_KEY
twofactor.api.key=YOUR_2FACTOR_API_KEY

# Google Services
google.maps.api.key=YOUR_GOOGLE_MAPS_API_KEY
google.translate.api-key=YOUR_GOOGLE_TRANSLATE_API_KEY
google.oauth.client-id=YOUR_GOOGLE_OAUTH_CLIENT_ID
google.oauth.client-secret=YOUR_GOOGLE_OAUTH_CLIENT_SECRET

# Security
otp.encryption.key=YOUR_OTP_ENCRYPTION_KEY
```

---

## Testing

### Postman Collection

Import the API endpoints into Postman for testing:

1. Create a new collection named "NeedStation API"
2. Add environment variables for base URL and tokens
3. Test each endpoint with sample data provided in this documentation

### Sample Test Flow

1. **User Registration Flow:**
   - POST `/api/auth/signup/step1` (Send OTP)
   - POST `/api/auth/signup/verify-otp` (Verify OTP)
   - POST `/api/auth/signup/step2` (Complete registration)

2. **User Login Flow:**
   - POST `/api/auth/loginUser` (Login)
   - Use returned JWT token for authenticated requests

3. **Worker Registration Flow:**
   - POST `/api/workers/registerWorker` (Register worker)
   - POST `/api/workers/otp/generate/{workerId}` (Generate OTP)
   - POST `/api/workers/otp/verify/{workerId}` (Verify OTP)

---

## Support

For API support and questions:
- **Email:** needstation3@gmail.com
- **Documentation:** This document
- **Base URL:** http://localhost:8080

---

**© 2025 NeedStation. All rights reserved.**
