# Worker Document Requirements & Verification Guide

## 📋 **Essential Documents Required from Workers**

### **1. Identity Verification Documents**

#### **Primary Identity Proof (MANDATORY)**
- **Aadhaar Card** (Preferred - Government issued, biometric)
  - Front and back clear photos
  - Verify name, address, DOB match application
  - Use Aadhaar verification API for real-time validation

#### **Secondary Identity Proof (MANDATORY)**
- **PAN Card** (Tax identification)
  - Clear photo of PAN card
  - Verify name matches Aadhaar
  - Use PAN verification API

#### **Photo Identity Verification**
- **Selfie with ID Proof** (Anti-fraud measure)
  - Worker holding Aadhaar card next to face
  - Clear visibility of both face and document
  - Prevents fake document submission

### **2. Address Verification Documents**

#### **Current Address Proof** (Choose any one)
- Utility bills (electricity, water, gas) - within 3 months
- Bank statement - within 3 months  
- Rental agreement (if rented)
- Property tax receipt
- Voter ID card

#### **Permanent Address Proof** (If different from current)
- Same options as current address proof
- Required if permanent address differs from current

### **3. Professional Qualification Documents**

#### **For Healthcare Workers (Nurses, Physiotherapists)**
- **Medical Degree/Diploma Certificate**
- **Professional Registration Certificate**
  - Nursing Council registration for nurses
  - Physiotherapy Council registration for physiotherapists
- **Experience Certificates** from previous employers
- **Continuing Education Certificates** (if applicable)

#### **For Caretakers**
- **Training Certificates** (elderly care, patient care)
- **First Aid Certification** (Red Cross, St. John's)
- **Experience Letters** from previous families/agencies
- **Character References** (2-3 references)

#### **For Security Guards**
- **Security Guard License** (mandatory in most states)
- **Training Certificate** from recognized security training institute
- **Physical Fitness Certificate**
- **Experience Letters** from security agencies

#### **For Pathologists**
- **Medical Laboratory Technology Degree/Diploma**
- **Professional Registration** with medical council
- **Laboratory Experience Certificates**
- **Equipment Handling Certifications**

### **4. Background Verification Documents**

#### **Police Verification (MANDATORY)**
- **Police Clearance Certificate**
  - From current address police station
  - Valid for 1 year from issue date
  - Shows no criminal background

#### **Medical Fitness Certificate**
- **Health Certificate** from registered medical practitioner
- **Blood Test Reports** (HIV, Hepatitis B, TB screening)
- **Mental Health Clearance** (for sensitive roles)
- **Drug Test Certificate** (for security roles)

### **5. Financial & Banking Documents**

#### **Bank Account Verification**
- **Bank Account Statement** (last 3 months)
- **Cancelled Cheque** or bank passbook first page
- **UPI QR Code** screenshot (for digital payments)

#### **Tax Compliance** (For experienced workers)
- **ITR (Income Tax Return)** for last 2 years
- **Form 16** from previous employer (if applicable)

---

## 🔍 **Document Verification Process**

### **Phase 1: Initial Document Submission**

#### **Step 1: Document Upload**
```javascript
// Frontend validation before upload
const requiredDocuments = [
  'aadhaar_front', 'aadhaar_back', 'pan_card', 
  'selfie_with_id', 'address_proof', 'qualification_certificate'
];

// File validation
- Maximum file size: 5MB per document
- Allowed formats: JPG, PNG, PDF
- Image resolution: Minimum 1024x768
- Clear, readable text required
```

#### **Step 2: Automated Validation**
```sql
-- Update verification status in database
UPDATE workers SET 
  document_submission_status = 'submitted',
  document_submitted_at = NOW()
WHERE id = worker_id;
```

### **Phase 2: Document Verification**

#### **Step 1: Automated Verification (API Integration)**

**Aadhaar Verification**
```javascript
// Use government Aadhaar verification API
const verifyAadhaar = async (aadhaarNumber, name, dob) => {
  const response = await fetch('https://api.uidai.gov.in/verify', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
    body: JSON.stringify({ aadhaar: aadhaarNumber, name, dob })
  });
  return response.json();
};
```

**PAN Verification**
```javascript
// Use Income Tax Department PAN verification
const verifyPAN = async (panNumber, name) => {
  const response = await fetch('https://api.incometax.gov.in/verify-pan', {
    method: 'POST',
    body: JSON.stringify({ pan: panNumber, name })
  });
  return response.json();
};
```

#### **Step 2: Manual Verification Checklist**

**Document Quality Check**
- [ ] Clear, readable text
- [ ] No tampering or editing signs
- [ ] Valid document format
- [ ] Not expired (check validity dates)
- [ ] Matches information in application

**Cross-Reference Verification**
- [ ] Name matches across all documents
- [ ] Address consistency check
- [ ] Date of birth matches
- [ ] Photo matches selfie

**Professional Qualification Check**
- [ ] Certificate authenticity (call issuing institute)
- [ ] Registration number verification
- [ ] Experience letter verification (call previous employers)

#### **Step 3: Police Verification Process**

**Initiate Police Verification**
```sql
-- Track police verification request
INSERT INTO police_verification_requests (
  worker_id, request_date, police_station, status
) VALUES (?, NOW(), ?, 'initiated');
```

**Police Verification Checklist**
- [ ] Submit application to local police station
- [ ] Provide worker's current address
- [ ] Include copy of Aadhaar and address proof
- [ ] Follow up after 15-30 days
- [ ] Collect clearance certificate

### **Phase 3: Medical Verification**

#### **Health Check Requirements**
```sql
-- Medical verification tracking
CREATE TABLE medical_verifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  worker_id BIGINT NOT NULL,
  medical_center VARCHAR(255),
  checkup_date DATE,
  blood_test_results JSON,
  fitness_status ENUM('fit', 'unfit', 'conditional'),
  valid_until DATE,
  certificate_url VARCHAR(500),
  FOREIGN KEY (worker_id) REFERENCES workers(id)
);
```

**Required Medical Tests**
- [ ] General health checkup
- [ ] Blood pressure, diabetes screening
- [ ] HIV, Hepatitis B, C testing
- [ ] TB screening (chest X-ray)
- [ ] Mental health assessment (for sensitive roles)
- [ ] Drug screening (for security roles)

### **Phase 4: Reference Verification**

#### **Professional References**
```sql
-- Reference verification tracking
CREATE TABLE worker_references (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  worker_id BIGINT NOT NULL,
  reference_name VARCHAR(255),
  reference_phone VARCHAR(20),
  reference_relation VARCHAR(100),
  verification_status ENUM('pending', 'verified', 'failed'),
  verification_date DATE,
  notes TEXT,
  FOREIGN KEY (worker_id) REFERENCES workers(id)
);
```

**Reference Check Process**
- [ ] Call previous employers/families
- [ ] Verify employment duration
- [ ] Check work quality and behavior
- [ ] Confirm reason for leaving
- [ ] Document feedback

---

## ⚡ **Verification Timeline & Status Tracking**

### **Expected Timeline**
- **Document Submission**: Day 1
- **Automated Verification**: Day 1-2
- **Manual Document Review**: Day 2-3
- **Police Verification**: Day 15-30
- **Medical Verification**: Day 3-7
- **Reference Verification**: Day 3-5
- **Final Approval**: Day 30-35

### **Status Tracking System**
```sql
-- Comprehensive verification status
ALTER TABLE workers ADD COLUMN verification_details JSON DEFAULT '{}';

-- Example verification_details structure:
{
  "documents": {
    "aadhaar": {"status": "verified", "verified_at": "2024-01-15"},
    "pan": {"status": "verified", "verified_at": "2024-01-15"},
    "selfie": {"status": "verified", "verified_at": "2024-01-15"},
    "qualification": {"status": "pending", "submitted_at": "2024-01-15"}
  },
  "background": {
    "police_verification": {"status": "in_progress", "initiated_at": "2024-01-16"},
    "medical_clearance": {"status": "verified", "valid_until": "2025-01-16"}
  },
  "references": {
    "reference_1": {"status": "verified", "verified_at": "2024-01-18"},
    "reference_2": {"status": "pending"}
  }
}
```

---

## 🚨 **Red Flags & Rejection Criteria**

### **Automatic Rejection**
- Fake or tampered documents
- Criminal background in police verification
- Failed medical fitness test
- Mismatched information across documents
- Unable to verify professional qualifications

### **Manual Review Required**
- Minor discrepancies in names (spelling variations)
- Expired documents (within 30 days)
- Incomplete reference verification
- Medical conditions requiring assessment

### **Conditional Approval**
- Medical conditions that don't affect work capability
- Pending police verification (with temporary approval)
- Missing non-critical documents

---

## 📱 **Technology Integration**

### **Document Scanning & OCR**
```javascript
// Automatic text extraction from documents
const extractDocumentData = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('/api/ocr/extract', {
    method: 'POST',
    body: formData
  });
  
  return response.json(); // Returns extracted text and data
};
```

### **Face Matching Technology**
```javascript
// Compare selfie with ID photo
const verifyFaceMatch = async (selfieImage, idPhotoImage) => {
  const response = await fetch('/api/face-match', {
    method: 'POST',
    body: JSON.stringify({
      selfie: selfieImage,
      idPhoto: idPhotoImage
    })
  });
  
  return response.json(); // Returns match confidence score
};
```

### **Blockchain Verification Storage**
```javascript
// Store verification hash on blockchain for tamper-proof records
const storeVerificationHash = async (workerId, documentHash) => {
  const transaction = await blockchainContract.storeVerification(
    workerId, 
    documentHash, 
    Date.now()
  );
  return transaction.hash;
};
```

This comprehensive verification system ensures worker authenticity, protects customers, and maintains platform credibility while complying with legal requirements.
