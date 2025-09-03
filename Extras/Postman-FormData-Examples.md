# Postman Form-Data Examples for Worker Registration

## **Step 1 - Basic Info with Profile Picture**

### **Form-Data Fields:**

| Key | Type | Value/File |
|-----|------|------------|
| `data` | Text | `{"fullName":"Test Worker","gender":"Male","dob":"1990-01-01","phone":"9876543210","email":"test@example.com","whatsappNumber":"9876543210"}` |
| `profilePicture` | File | Select image file (.jpg, .jpeg, .png) |

### **Raw Form-Data:**
```
--boundary123456
Content-Disposition: form-data; name="data"
Content-Type: application/json

{"fullName":"Test Worker","gender":"Male","dob":"1990-01-01","phone":"9876543210","email":"test@example.com","whatsappNumber":"9876543210"}

--boundary123456
Content-Disposition: form-data; name="profilePicture"; filename="profile.jpg"
Content-Type: image/jpeg

[Binary image data]
--boundary123456--
```

---

## **Step 4 - Verification with File Uploads**

### **Form-Data Fields:**

| Key | Type | Value/File |
|-----|------|------------|
| `data` | Text | `{"aadharNumber":"123456789012","policeVerificationStatus":"Applied"}` |
| `idProof` | File | Select ID document (.jpg, .jpeg, .png, .pdf) |
| `selfieWithId` | File | Select selfie image (.jpg, .jpeg, .png) |
| `certificates` | File | Select certificate 1 (.pdf, .jpg, .jpeg, .png) |
| `certificates` | File | Select certificate 2 (.pdf, .jpg, .jpeg, .png) |
| `certificates` | File | Select certificate 3 (.pdf, .jpg, .jpeg, .png) |

### **Raw Form-Data:**
```
--boundary123456
Content-Disposition: form-data; name="data"
Content-Type: application/json

{"aadharNumber":"123456789012","policeVerificationStatus":"Applied"}

--boundary123456
Content-Disposition: form-data; name="idProof"; filename="aadhaar.jpg"
Content-Type: image/jpeg

[Binary image data]

--boundary123456
Content-Disposition: form-data; name="selfieWithId"; filename="selfie.jpg"
Content-Type: image/jpeg

[Binary image data]

--boundary123456
Content-Disposition: form-data; name="certificates"; filename="certificate1.pdf"
Content-Type: application/pdf

[Binary PDF data]

--boundary123456
Content-Disposition: form-data; name="certificates"; filename="certificate2.jpg"
Content-Type: image/jpeg

[Binary image data]

--boundary123456
Content-Disposition: form-data; name="certificates"; filename="certificate3.png"
Content-Type: image/png

[Binary image data]
--boundary123456--
```

---

## **Postman Setup Instructions**

### **Step 1 Setup:**
1. **Method:** POST
2. **URL:** `http://localhost:8080/api/worker/register/step1`
3. **Headers:** Remove Content-Type (Postman auto-sets for form-data)
4. **Body → form-data:**
   - Add `data` field (Text) with JSON value
   - Add `profilePicture` field (File) and select image

### **Step 4 Setup:**
1. **Method:** POST  
2. **URL:** `http://localhost:8080/api/worker/register/step4?workerId=1`
3. **Headers:** Remove Content-Type (Postman auto-sets for form-data)
4. **Body → form-data:**
   - Add `data` field (Text) with JSON value
   - Add `idProof` field (File) and select ID document
   - Add `selfieWithId` field (File) and select selfie image
   - Add multiple `certificates` fields (File) for each certificate

### **File Requirements:**
- **Profile Picture:** Max 2MB, auto-compressed to 100KB
- **ID Proof:** Clear scan/photo of Aadhaar/PAN/Voter ID
- **Selfie:** Clear photo holding ID document
- **Certificates:** Skills/training certificates (optional)

### **Expected Response Fields:**
- **Step 1:** `profileImageUrl` with Cloudinary URL
- **Step 4:** `idProofUrl`, `selfieWithIdUrl`, `certificateUrls` with Cloudinary URLs
