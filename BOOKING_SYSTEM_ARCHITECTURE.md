# NeedStation Booking System Architecture

## 📋 Table of Contents
1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Data Flow](#data-flow)
4. [API Endpoints](#api-endpoints)
5. [Frontend Integration](#frontend-integration)
6. [Example Scenarios](#example-scenarios)
7. [Implementation Steps](#implementation-steps)

---

## 🎯 Overview

### The Challenge
NeedStation has:
- **13 main services** (Elderly Care, Nursing Care, Physiotherapy, etc.)
- Each service has **~4 subservices** (e.g., Elderly Care → Companionship, Medication Reminders, Meal Preparation, Mobility Support)
- Each service has **unique formality requirements** (e.g., patient age, medical history, equipment needed)
- Users can book **multiple services** in one session
- Each booking needs to track: contact info, location, scheduling, worker assignment, status, and payment

### The Solution
A **normalized relational database** with 6 core tables that work together:

```
┌─────────────┐
│  SERVICES   │ ← 13 main services (Elderly Care, Nursing Care, etc.)
└──────┬──────┘
       │
       ├──→ ┌──────────────────┐
       │    │  SUB_SERVICES    │ ← 4 subservices per service
       │    └──────────────────┘
       │
       └──→ ┌──────────────────────────┐
            │ SERVICE_FORMALITIES      │ ← Dynamic form fields per service
            └──────────────────────────┘

┌──────────────┐
│   BOOKINGS   │ ← Main booking record (contact, location, scheduling, status)
└──────┬───────┘
       │
       ├──→ ┌──────────────────────────┐
       │    │ BOOKING_SUB_SERVICES     │ ← Which subservices were selected
       │    └──────────────────────────┘
       │
       └──→ ┌──────────────────────────┐
            │ BOOKING_FORMALITY_DATA   │ ← User's answers to formality questions
            └──────────────────────────┘
```

---

## 🗄️ Database Schema

### 1. SERVICES Table
**Purpose:** Stores the 13 main service categories

```sql
CREATE TABLE services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(100) NOT NULL UNIQUE,      -- "Elderly Care"
    service_code VARCHAR(50) NOT NULL UNIQUE,       -- "ELDERLY_CARE"
    description TEXT,                                -- Service description
    base_price DECIMAL(10,2),                       -- Starting price
    is_active BOOLEAN DEFAULT TRUE,                 -- Can be booked?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Example Data:**
| id | service_name | service_code | base_price | is_active |
|----|--------------|--------------|------------|-----------|
| 1  | Elderly Care | ELDERLY_CARE | 900.00     | TRUE      |
| 2  | Nursing Care | NURSING_CARE | 1200.00    | TRUE      |
| 3  | Physiotherapy| PHYSIOTHERAPY| 800.00     | TRUE      |

---

### 2. SUB_SERVICES Table
**Purpose:** Stores the 4 subservices under each main service

```sql
CREATE TABLE sub_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_id BIGINT NOT NULL,                     -- Links to SERVICES table
    sub_service_name VARCHAR(100) NOT NULL,         -- "Companionship"
    description TEXT,                                -- Subservice description
    additional_price DECIMAL(10,2) DEFAULT 0,       -- Extra cost for this subservice
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
```

**Example Data (for Elderly Care):**
| id | service_id | sub_service_name      | additional_price |
|----|------------|-----------------------|------------------|
| 1  | 1          | Companionship         | 0.00             |
| 2  | 1          | Medication Reminders  | 100.00           |
| 3  | 1          | Meal Preparation      | 150.00           |
| 4  | 1          | Mobility Support      | 200.00           |

---

### 3. SERVICE_FORMALITIES Table
**Purpose:** Defines what questions/fields to show for each service (dynamic form builder)

```sql
CREATE TABLE service_formalities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    service_id BIGINT NOT NULL,                     -- Links to SERVICES table
    formality_type VARCHAR(50) NOT NULL,            -- Category: 'PATIENT_INFO', 'CARE_DETAILS'
    field_name VARCHAR(100) NOT NULL,               -- 'patient_age', 'medical_conditions'
    field_type VARCHAR(50) NOT NULL,                -- 'TEXT', 'NUMBER', 'DATE', 'SELECT', 'CHECKBOX', 'TEXTAREA'
    is_required BOOLEAN DEFAULT FALSE,              -- Mandatory field?
    options TEXT,                                    -- JSON array for SELECT/CHECKBOX: ["4 hours", "8 hours", "12 hours"]
    placeholder VARCHAR(255),                        -- Input placeholder text
    validation_rules TEXT,                           -- JSON: {"min": 60, "max": 120}
    display_order INT DEFAULT 0,                    -- Order to show fields
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
```

**Example Data (for Elderly Care):**
| id | service_id | field_name         | field_type | is_required | options                                      | display_order |
|----|------------|--------------------|------------|-------------|----------------------------------------------|---------------|
| 1  | 1          | patient_age        | NUMBER     | TRUE        | NULL                                         | 1             |
| 2  | 1          | medical_conditions | TEXTAREA   | FALSE       | NULL                                         | 2             |
| 3  | 1          | hours_per_day      | SELECT     | TRUE        | ["4 hours", "8 hours", "12 hours", "24 hours"] | 3             |
| 4  | 1          | mobility_level     | SELECT     | TRUE        | ["Independent", "Needs Support", "Wheelchair"] | 4             |

**Why This is Powerful:**
- ✅ Each service can have completely different form fields
- ✅ No need to change database schema when adding new services
- ✅ Frontend dynamically renders forms based on this data
- ✅ Easy to add/remove/modify fields without code changes

---

### 4. BOOKINGS Table
**Purpose:** Main booking record with contact info, location, scheduling, and status

```sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_number VARCHAR(50) UNIQUE NOT NULL,     -- "BK20251016001"
    user_id BIGINT NOT NULL,                        -- Who made the booking
    service_id BIGINT NOT NULL,                     -- Which main service
    
    -- Contact & Location (from Step 1 of booking modal)
    phone VARCHAR(15) NOT NULL,
    alternate_phone VARCHAR(15),
    full_address TEXT NOT NULL,
    landmark VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    location_lat DECIMAL(10,8),                     -- GPS coordinates
    location_lng DECIMAL(11,8),
    location_address TEXT,                          -- Reverse geocoded address
    
    -- Scheduling (from Step 3 of booking modal)
    preferred_date DATE NOT NULL,
    preferred_time TIME,
    preferred_time_slot VARCHAR(50),                -- "Morning", "Afternoon", "Evening"
    urgency VARCHAR(20) DEFAULT 'NORMAL',           -- 'NORMAL', 'URGENT', 'EMERGENCY'
    
    -- Status & Tracking
    status VARCHAR(50) DEFAULT 'PENDING',           -- 'PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
    assigned_worker_id BIGINT,                      -- Which worker is assigned
    
    -- Pricing
    base_amount DECIMAL(10,2),                      -- Service base price
    additional_charges DECIMAL(10,2) DEFAULT 0,     -- Subservices + extras
    total_amount DECIMAL(10,2),                     -- Final amount
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    scheduled_at TIMESTAMP,                         -- When service is scheduled
    completed_at TIMESTAMP,                         -- When service was completed
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (assigned_worker_id) REFERENCES workers(id)
);
```

**Example Data:**
| id | booking_number | user_id | service_id | phone      | full_address        | preferred_date | status   | total_amount |
|----|----------------|---------|------------|------------|---------------------|----------------|----------|--------------|
| 1  | BK20251016001  | 123     | 1          | 8357028350 | Flat 603, Indore... | 2025-10-20     | PENDING  | 1250.00      |
| 2  | BK20251016002  | 124     | 2          | 9876543210 | House 45, Bhopal... | 2025-10-18     | CONFIRMED| 1500.00      |

---

### 5. BOOKING_SUB_SERVICES Table
**Purpose:** Tracks which subservices were selected for each booking (many-to-many relationship)

```sql
CREATE TABLE booking_sub_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,                     -- Links to BOOKINGS table
    sub_service_id BIGINT NOT NULL,                 -- Links to SUB_SERVICES table
    quantity INT DEFAULT 1,                         -- How many times (usually 1)
    price DECIMAL(10,2),                            -- Price at time of booking
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (sub_service_id) REFERENCES sub_services(id)
);
```

**Example Data (for Booking #1):**
| id | booking_id | sub_service_id | quantity | price  |
|----|------------|----------------|----------|--------|
| 1  | 1          | 2              | 1        | 100.00 |
| 2  | 1          | 4              | 1        | 200.00 |

**Meaning:** Booking #1 selected "Medication Reminders" (₹100) and "Mobility Support" (₹200)

---

### 6. BOOKING_FORMALITY_DATA Table
**Purpose:** Stores user's answers to the formality questions

```sql
CREATE TABLE booking_formality_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,                     -- Links to BOOKINGS table
    formality_id BIGINT NOT NULL,                   -- Links to SERVICE_FORMALITIES table
    field_value TEXT,                               -- User's answer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (formality_id) REFERENCES service_formalities(id)
);
```

**Example Data (for Booking #1):**
| id | booking_id | formality_id | field_value           |
|----|------------|--------------|-----------------------|
| 1  | 1          | 1            | 75                    |
| 2  | 1          | 2            | Diabetes, High BP     |
| 3  | 1          | 3            | 8 hours               |
| 4  | 1          | 4            | Needs Support         |

**Meaning:** For Booking #1:
- Patient age: 75
- Medical conditions: Diabetes, High BP
- Hours per day: 8 hours
- Mobility level: Needs Support

---

## 🔄 Data Flow

### User Journey: Booking Elderly Care

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: User Selects Service                                    │
│ - User clicks "Book Elderly Care"                               │
│ - Frontend fetches: /api/services/ELDERLY_CARE                  │
│ - Gets: service details, subservices, formalities               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: User Fills Contact & Location (BookingModal Step 1)    │
│ - Phone: 8357028350                                             │
│ - Address: Flat 603, Shalimar Township, Indore                  │
│ - Location: lat=22.7196, lng=75.8577                            │
│ - Saved to: formData state                                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: User Fills Service Details (BookingModal Step 2)       │
│ - Frontend renders dynamic form based on SERVICE_FORMALITIES    │
│ - Patient Age: 75                                               │
│ - Medical Conditions: Diabetes, High BP                         │
│ - Hours per day: 8 hours                                        │
│ - Mobility level: Needs Support                                 │
│ - Subservices: [Medication Reminders, Mobility Support]         │
│ - Saved to: formData.serviceDetails state                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: User Selects Date & Time (BookingModal Step 3)         │
│ - Preferred Date: 2025-10-20                                    │
│ - Preferred Time: 10:00 AM                                      │
│ - Urgency: Normal                                               │
│ - Saved to: formData state                                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Submit Booking                                          │
│ - Frontend sends: POST /api/bookings                            │
│ - Backend creates:                                              │
│   1. BOOKINGS record (main booking)                             │
│   2. BOOKING_SUB_SERVICES records (selected subservices)        │
│   3. BOOKING_FORMALITY_DATA records (formality answers)         │
│ - Returns: booking_number, booking_id, status                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: Confirmation                                            │
│ - User sees: "Booking confirmed! Booking #BK20251016001"        │
│ - Email/SMS sent with booking details                           │
│ - Admin dashboard shows new booking                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### 1. Get Service Details
```http
GET /api/services/{serviceCode}
```

**Response:**
```json
{
  "service": {
    "id": 1,
    "name": "Elderly Care",
    "code": "ELDERLY_CARE",
    "description": "Compassionate care for seniors",
    "basePrice": 900.00
  },
  "subServices": [
    {
      "id": 1,
      "name": "Companionship",
      "additionalPrice": 0
    },
    {
      "id": 2,
      "name": "Medication Reminders",
      "additionalPrice": 100
    }
  ],
  "formalities": [
    {
      "id": 1,
      "fieldName": "patient_age",
      "fieldType": "NUMBER",
      "isRequired": true,
      "placeholder": "Enter patient age",
      "validationRules": {"min": 60, "max": 120}
    },
    {
      "id": 2,
      "fieldName": "medical_conditions",
      "fieldType": "TEXTAREA",
      "isRequired": false,
      "placeholder": "Any medical conditions?"
    }
  ]
}
```

---

### 2. Create Booking
```http
POST /api/bookings
```

**Request Body:**
```json
{
  "userId": 123,
  "serviceId": 1,
  "contactInfo": {
    "phone": "8357028350",
    "alternatePhone": "9876543210",
    "fullAddress": "Flat 603, Shalimar Township, Indore",
    "landmark": "Near City Mall",
    "city": "Indore",
    "state": "Madhya Pradesh",
    "pincode": "452010",
    "locationLat": 22.7196,
    "locationLng": 75.8577,
    "locationAddress": "Shalimar Township, Indore, MP"
  },
  "scheduling": {
    "preferredDate": "2025-10-20",
    "preferredTime": "10:00",
    "preferredTimeSlot": "Morning",
    "urgency": "NORMAL"
  },
  "selectedSubServices": [2, 4],
  "formalityData": {
    "1": "75",
    "2": "Diabetes, High BP",
    "3": "8 hours",
    "4": "Needs Support"
  }
}
```

**Response:**
```json
{
  "success": true,
  "bookingNumber": "BK20251016001",
  "bookingId": 1,
  "status": "PENDING",
  "totalAmount": 1250.00,
  "message": "Booking created successfully"
}
```

---

### 3. Get User Bookings
```http
GET /api/bookings/user/{userId}
```

**Response:**
```json
{
  "bookings": [
    {
      "id": 1,
      "bookingNumber": "BK20251016001",
      "serviceName": "Elderly Care",
      "status": "PENDING",
      "preferredDate": "2025-10-20",
      "totalAmount": 1250.00,
      "createdAt": "2025-10-16T01:00:00",
      "subServices": ["Medication Reminders", "Mobility Support"]
    }
  ]
}
```

---

### 4. Get Booking Details
```http
GET /api/bookings/{bookingId}
```

**Response:**
```json
{
  "booking": {
    "id": 1,
    "bookingNumber": "BK20251016001",
    "service": {
      "name": "Elderly Care",
      "code": "ELDERLY_CARE"
    },
    "contactInfo": {
      "phone": "8357028350",
      "fullAddress": "Flat 603, Shalimar Township, Indore"
    },
    "scheduling": {
      "preferredDate": "2025-10-20",
      "preferredTime": "10:00",
      "urgency": "NORMAL"
    },
    "subServices": [
      {"name": "Medication Reminders", "price": 100.00},
      {"name": "Mobility Support", "price": 200.00}
    ],
    "formalityData": {
      "patient_age": "75",
      "medical_conditions": "Diabetes, High BP",
      "hours_per_day": "8 hours",
      "mobility_level": "Needs Support"
    },
    "status": "PENDING",
    "totalAmount": 1250.00
  }
}
```

---

## 💻 Frontend Integration

### BookingModal Component Flow

```javascript
// Step 1: Fetch service configuration
useEffect(() => {
  const fetchServiceConfig = async () => {
    const response = await fetch(`/api/services/${serviceCode}`);
    const data = await response.json();
    
    setServiceConfig({
      service: data.service,
      subServices: data.subServices,
      formalities: data.formalities
    });
  };
  
  fetchServiceConfig();
}, [serviceCode]);

// Step 2: Render dynamic formality fields
const renderFormalityFields = () => {
  return serviceConfig.formalities.map(formality => {
    switch(formality.fieldType) {
      case 'NUMBER':
        return <input type="number" {...formality} />;
      case 'SELECT':
        return <select>{JSON.parse(formality.options).map(opt => <option>{opt}</option>)}</select>;
      case 'TEXTAREA':
        return <textarea {...formality} />;
      // ... other field types
    }
  });
};

// Step 3: Submit booking
const handleSubmit = async () => {
  const bookingData = {
    userId: userProfile.id,
    serviceId: serviceConfig.service.id,
    contactInfo: {
      phone: formData.phone,
      alternatePhone: formData.alternatePhone,
      fullAddress: formData.address,
      // ... other contact fields
    },
    scheduling: {
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      urgency: formData.urgency
    },
    selectedSubServices: formData.selectedSubServices,
    formalityData: formData.serviceDetails
  };
  
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(bookingData)
  });
  
  const result = await response.json();
  if (result.success) {
    showConfirmation(result.bookingNumber);
  }
};
```

---

## 📚 Example Scenarios

### Scenario 1: Simple Booking (Single Subservice)

**User Action:** Book Elderly Care → Companionship only

**Database Records Created:**

1. **BOOKINGS table:**
```
id: 1
booking_number: BK20251016001
service_id: 1 (Elderly Care)
phone: 8357028350
total_amount: 900.00
status: PENDING
```

2. **BOOKING_SUB_SERVICES table:**
```
booking_id: 1
sub_service_id: 1 (Companionship)
price: 0.00
```

3. **BOOKING_FORMALITY_DATA table:**
```
booking_id: 1, formality_id: 1, field_value: "75"
booking_id: 1, formality_id: 2, field_value: "Diabetes"
booking_id: 1, formality_id: 3, field_value: "8 hours"
```

---

### Scenario 2: Complex Booking (Multiple Subservices)

**User Action:** Book Elderly Care → Medication Reminders + Meal Preparation + Mobility Support

**Database Records Created:**

1. **BOOKINGS table:**
```
total_amount: 1350.00 (900 base + 100 + 150 + 200)
```

2. **BOOKING_SUB_SERVICES table:**
```
booking_id: 1, sub_service_id: 2 (Medication Reminders), price: 100.00
booking_id: 1, sub_service_id: 3 (Meal Preparation), price: 150.00
booking_id: 1, sub_service_id: 4 (Mobility Support), price: 200.00
```

---

### Scenario 3: Multi-Service Booking (Cart with 2 Services)

**User Action:** Add Elderly Care to cart → Add Nursing Care to cart → Book All

**Database Records Created:**

**Booking 1 (Elderly Care):**
```
id: 1, service_id: 1, total_amount: 1250.00
```

**Booking 2 (Nursing Care):**
```
id: 2, service_id: 2, total_amount: 1500.00
```

**Note:** Each service creates a separate booking record because they may have:
- Different workers assigned
- Different scheduling
- Different formality requirements
- Different locations (if user wants services at different addresses)

---

## 🚀 Implementation Steps

### Phase 1: Database Setup (Week 1)

1. **Create Migration Files:**
   - `V7__create_services_table.sql`
   - `V8__create_sub_services_table.sql`
   - `V9__create_service_formalities_table.sql`
   - `V10__create_bookings_table.sql`
   - `V11__create_booking_sub_services_table.sql`
   - `V12__create_booking_formality_data_table.sql`

2. **Seed Initial Data:**
   - Insert 13 services
   - Insert subservices for each service
   - Insert formality configurations for each service

---

### Phase 2: Backend Development (Week 2-3)

1. **Create Entities:**
   - `Service.java`
   - `SubService.java`
   - `ServiceFormality.java`
   - `Booking.java`
   - `BookingSubService.java`
   - `BookingFormalityData.java`

2. **Create Repositories:**
   - `ServiceRepository.java`
   - `BookingRepository.java`
   - etc.

3. **Create DTOs:**
   - `ServiceConfigDTO.java` (service + subservices + formalities)
   - `CreateBookingDTO.java` (booking request)
   - `BookingResponseDTO.java` (booking details)

4. **Create Controllers:**
   - `ServiceController.java` → `/api/services/*`
   - `BookingController.java` → `/api/bookings/*`

5. **Create Services:**
   - `ServiceService.java` (business logic for services)
   - `BookingService.java` (business logic for bookings)

---

### Phase 3: Frontend Development (Week 4-5)

1. **Update BookingModal:**
   - Fetch service configuration dynamically
   - Render formality fields based on configuration
   - Handle dynamic form validation
   - Submit booking with all data

2. **Create Booking Management:**
   - User bookings page (`/my-bookings`)
   - Booking details page (`/booking/{id}`)
   - Booking status tracking

3. **Update Cart System:**
   - Handle multiple services in cart
   - Show service-specific details in cart
   - Batch booking creation

---

### Phase 4: Admin Dashboard (Week 6)

1. **Service Management:**
   - Add/edit/delete services
   - Manage subservices
   - Configure formalities

2. **Booking Management:**
   - View all bookings
   - Assign workers
   - Update booking status
   - View formality responses

---

## 🎓 Key Concepts Explained

### 1. Why Separate Tables?

**Bad Approach (Single Table):**
```sql
CREATE TABLE bookings (
    id BIGINT,
    service_name VARCHAR(100),
    subservice1 VARCHAR(100),
    subservice2 VARCHAR(100),
    subservice3 VARCHAR(100),
    patient_age INT,
    medical_conditions TEXT,
    -- Problem: What if service needs different fields?
    -- Problem: What if user selects 5 subservices?
);
```

**Good Approach (Normalized):**
- ✅ Flexible: Each service can have any number of subservices
- ✅ Scalable: Easy to add new services without schema changes
- ✅ Maintainable: Changes to one service don't affect others
- ✅ Queryable: Easy to find bookings by service, status, date, etc.

---

### 2. Dynamic Form Fields

Instead of hardcoding form fields in frontend:

```javascript
// ❌ Bad: Hardcoded
<input name="patient_age" type="number" />
<textarea name="medical_conditions" />
```

We dynamically generate based on database:

```javascript
// ✅ Good: Dynamic
{formalities.map(field => renderField(field))}
```

**Benefits:**
- Add new services without code changes
- Different forms for different services
- Easy to modify field requirements
- Admin can configure forms via dashboard

---

### 3. Many-to-Many Relationships

**Problem:** A booking can have multiple subservices, and a subservice can be in multiple bookings.

**Solution:** Junction table `BOOKING_SUB_SERVICES`

```
BOOKINGS ←→ BOOKING_SUB_SERVICES ←→ SUB_SERVICES
```

This allows:
- One booking → many subservices
- One subservice → many bookings
- Track quantity and price per subservice

---

## 📊 Performance Considerations

### Indexes
```sql
-- Speed up booking queries
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_date ON bookings(preferred_date);

-- Speed up formality lookups
CREATE INDEX idx_formalities_service_id ON service_formalities(service_id);
```

### Caching
- Cache service configurations (rarely change)
- Cache formality definitions (rarely change)
- Don't cache bookings (frequently updated)

---

## 🔐 Security Considerations

1. **User can only view their own bookings:**
```java
if (!booking.getUserId().equals(currentUser.getId())) {
    throw new UnauthorizedException();
}
```

2. **Validate formality data:**
```java
// Check required fields are filled
// Validate data types match field_type
// Validate against validation_rules
```

3. **Prevent SQL injection:**
- Use JPA/Hibernate (parameterized queries)
- Never concatenate user input into SQL

---

## 📝 Summary

### What We Built:
- ✅ Flexible booking system for 13 services
- ✅ Dynamic form fields per service
- ✅ Support for multiple subservices per booking
- ✅ Complete booking lifecycle tracking
- ✅ Scalable architecture for future growth

### Why This Design:
- ✅ **Normalized:** No data redundancy
- ✅ **Flexible:** Easy to add new services
- ✅ **Scalable:** Handles growth efficiently
- ✅ **Maintainable:** Clear separation of concerns
- ✅ **Queryable:** Easy to generate reports and analytics

### Next Steps:
1. Review this documentation
2. Approve the schema design
3. I'll create the migration files
4. I'll create the Java entities
5. I'll create the API endpoints
6. I'll update the frontend

---

**Questions? Let me know which part you'd like me to explain further!** 🚀
