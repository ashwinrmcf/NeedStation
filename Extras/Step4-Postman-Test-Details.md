# Step 4 - Worker Verification with File Uploads

## **Endpoint Details**
- **URL:** `http://localhost:8080/api/worker/register/step4?workerId={workerId}`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

## **URL Parameters**
- **workerId:** Use the ID returned from Step 1 (e.g., `?workerId=1`)

## **Request Body (Form Data)**

### **1. JSON Data Field**
- **Key:** `data`
- **Type:** `Text`
- **Content-Type:** `application/json`
- **Value:**
```json
{
  "aadharNumber": "123456789012",
  "policeVerificationStatus": "Applied"
}
```

### **2. ID Proof Document**
- **Key:** `idProof`
- **Type:** `File`
- **Accepted Formats:** `.jpg`, `.jpeg`, `.png`, `.pdf`
- **Description:** Aadhaar/PAN/Voter ID scan
- **File Path:** Select ID document image/PDF

### **3. Selfie with ID**
- **Key:** `selfieWithId`
- **Type:** `File`
- **Accepted Formats:** `.jpg`, `.jpeg`, `.png`
- **Description:** Clear selfie holding ID document
- **File Path:** Select selfie image

### **4. Certificates (Optional - Multiple Files)**
- **Key:** `certificates` (can repeat this key for multiple files)
- **Type:** `File`
- **Accepted Formats:** `.pdf`, `.jpg`, `.jpeg`, `.png`
- **Description:** Skills/training certificates
- **File Path:** Select certificate files

## **Expected Response**
```json
{
  "id": 1,
  "fullName": "Test Worker",
  "aadharNumber": "123456789012",
  "policeVerificationStatus": "Applied",
  "idProofUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123456789/worker_profiles/id_proof_abc123.jpg",
  "selfieWithIdUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123456789/worker_profiles/selfie_abc123.jpg",
  "certificateUrls": "{\"certificate_1\":\"https://res.cloudinary.com/your-cloud/image/upload/v123456789/worker_profiles/cert_abc123.pdf\",\"certificate_2\":\"https://res.cloudinary.com/your-cloud/image/upload/v123456789/worker_profiles/cert_def456.pdf\"}",
  "registrationStatus": "STEP_4_COMPLETED"
}
```

## **What to Check**
1. **✅ Success:** All file URLs contain Cloudinary URLs
   - `idProofUrl`: Should have Cloudinary URL
   - `selfieWithIdUrl`: Should have Cloudinary URL  
   - `certificateUrls`: JSON string with certificate URLs
2. **❌ Failure:** Any of these fields are `null` or empty
3. **Status Code:** Should be `200 OK`

## **Certificate URLs Format**
The `certificateUrls` field stores a JSON string:
```json
{
  "certificate_1": "https://res.cloudinary.com/your-cloud/...",
  "certificate_2": "https://res.cloudinary.com/your-cloud/...",
  "certificate_3": "https://res.cloudinary.com/your-cloud/..."
}
```

## **Troubleshooting**
- **400 Bad Request:** Missing workerId parameter or invalid JSON
- **404 Not Found:** Worker with given ID doesn't exist
- **500 Internal Server Error:** Cloudinary upload failure
- **Null URLs:** Backend not processing file uploads correctly

## **Backend Logs to Monitor**
Look for these messages for each file upload:
```
Uploading image to Cloudinary. File size: [size], Content Type: [type]
Image uploaded successfully to: [cloudinary-url]
Step 4 saved successfully: [response-data]
```

## **Testing Multiple Certificates**
In Postman, add multiple form-data entries with the same key:
- `certificates` → file1.pdf
- `certificates` → file2.jpg  
- `certificates` → file3.png

The backend will process all files and create numbered certificate URLs.
