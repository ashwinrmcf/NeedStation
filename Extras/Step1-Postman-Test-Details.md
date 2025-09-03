# Step 1 - Worker Registration with Profile Picture Upload

## **Endpoint Details**
- **URL:** `http://localhost:8080/api/worker/register/step1`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

## **Request Body (Form Data)**

### **1. JSON Data Field**
- **Key:** `data`
- **Type:** `Text`
- **Content-Type:** `application/json`
- **Value:**
```json
{
  "fullName": "Test Worker",
  "gender": "Male",
  "dob": "1990-01-01",
  "phone": "9876543210",
  "email": "test@example.com",
  "whatsappNumber": "9876543210"
}
```

### **2. Profile Picture File**
- **Key:** `profilePicture`
- **Type:** `File`
- **Accepted Formats:** `.jpg`, `.jpeg`, `.png`
- **Max Size:** 2MB (auto-compressed to 100KB)
- **File Path:** Select any test image file

## **Expected Response**
```json
{
  "id": 1,
  "fullName": "Test Worker",
  "gender": "Male",
  "dob": "1990-01-01",
  "phone": "9876543210",
  "email": "test@example.com",
  "whatsappNumber": "9876543210",
  "profileImageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123456789/worker_profiles/abc123.jpg",
  "registrationStatus": "STEP_1_COMPLETED",
  "registrationDate": "2025-08-28",
  "phoneVerified": false,
  "otpAttempts": 0
}
```

## **What to Check**
1. **✅ Success:** `profileImageUrl` contains a Cloudinary URL starting with `https://res.cloudinary.com/`
2. **❌ Failure:** `profileImageUrl` is `null` or empty string
3. **Status Code:** Should be `200 OK`
4. **Worker ID:** Note the returned `id` for Step 4 testing

## **Troubleshooting**
- **400 Bad Request:** Check JSON format in `data` field
- **500 Internal Server Error:** Backend Cloudinary configuration issue
- **Null profileImageUrl:** Backend not using fixed WorkerService

## **Backend Logs to Monitor**
Look for these messages in your Spring Boot console:
```
Uploading image to Cloudinary. File size: [size], Content Type: [type]
Image uploaded successfully to: [cloudinary-url]
```

If you don't see these logs, the backend isn't calling the Cloudinary upload method.
