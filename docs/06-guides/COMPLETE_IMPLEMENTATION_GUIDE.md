# Complete Implementation Guide

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Node.js 16+
- Git

### 1. Backend Setup

```bash
# Navigate to backend directory
cd Backend/authbackend

# Install dependencies
mvn clean install

# Configure database (application.properties)
spring.datasource.url=jdbc:mysql://localhost:3306/needstation
spring.datasource.username=your_username
spring.datasource.password=your_password

# Run the application
mvn spring-boot:run
```

**Expected Output:**
```
✅ Flyway migrations applied (V7-V13)
✅ 13 services created
✅ 52 subservices created
✅ 52 formality fields created
✅ Server started on port 8080
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend/Need_Station_MP-main

# Install dependencies
npm install

# Start development server
npm start
```

**Expected Output:**
```
✅ Development server started on port 3000
✅ Connected to backend API
```

---

## 🧪 Testing the Implementation

### 1. Verify Database Setup

```sql
-- Check migrations applied
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 10;

-- Verify services
SELECT id, service_name, service_code, base_price FROM services LIMIT 5;

-- Verify subservices
SELECT id, service_id, sub_service_name, additional_price 
FROM sub_services WHERE service_id = 6 LIMIT 5;

-- Verify formalities
SELECT id, service_id, field_name, field_type, is_required 
FROM service_formalities WHERE service_id = 6 LIMIT 5;
```

### 2. Test API Endpoints

```bash
# Get all services
curl http://localhost:8080/api/services

# Get service configuration
curl http://localhost:8080/api/services/ELDERLY_CARE

# Create a test booking
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "serviceId": 6,
    "contactInfo": {
      "phone": "8357028350",
      "fullAddress": "Flat 603, Indore",
      "city": "Indore",
      "pincode": "452010",
      "locationLat": 22.7196,
      "locationLng": 75.8577
    },
    "scheduling": {
      "preferredDate": "2025-10-20",
      "preferredTime": "10:00",
      "urgency": "NORMAL"
    },
    "selectedSubServices": [22, 23],
    "formalityData": {
      "patient_age": "75",
      "medical_conditions": "Diabetes"
    }
  }'
```

### 3. Test Frontend Booking Flow

1. **Open browser:** `http://localhost:3000`
2. **Navigate to service page** (e.g., Elderly Care)
3. **Click "Book Now"**
4. **Complete Step 1:** Contact & Location
   - Enter phone number
   - Select location on map
   - Fill address details
5. **Complete Step 2:** Service Details
   - Select subservices (should load from API)
   - Fill formality fields
6. **Complete Step 3:** Scheduling
   - Select date, time, urgency
7. **Submit booking**
8. **Verify success:** Should show booking number

---

## 📊 API Documentation

### Service Endpoints

#### GET /api/services
**Description:** Get all active services  
**Response:**
```json
[
  {
    "id": 1,
    "serviceName": "Home Security Guard",
    "serviceCode": "HOME_SECURITY_GUARD",
    "basePrice": 800.00
  }
]
```

#### GET /api/services/{serviceCode}
**Description:** Get complete service configuration  
**Parameters:** 
- `serviceCode`: Service code (e.g., ELDERLY_CARE)

**Response:**
```json
{
  "service": {
    "id": 6,
    "serviceName": "Elderly Care",
    "serviceCode": "ELDERLY_CARE",
    "basePrice": 900.00
  },
  "subServices": [
    {
      "id": 22,
      "subServiceName": "Medication Management",
      "description": "Help with medication schedules",
      "additionalPrice": 150.00
    }
  ],
  "formalities": [
    {
      "id": 1,
      "fieldName": "patient_age",
      "fieldLabel": "Patient Age",
      "fieldType": "NUMBER",
      "isRequired": true
    }
  ]
}
```

### Booking Endpoints

#### POST /api/bookings
**Description:** Create a new booking  
**Request Body:**
```json
{
  "userId": 1,
  "serviceId": 6,
  "contactInfo": {
    "phone": "8357028350",
    "alternatePhone": "9876543210",
    "fullAddress": "Flat 603, Shalimar Township, Indore",
    "landmark": "Near City Mall",
    "city": "Indore",
    "state": "Madhya Pradesh",
    "pincode": "452010",
    "locationLat": 22.7196,
    "locationLng": 75.8577
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
    "medical_conditions": "Diabetes, High BP",
    "mobility_level": "limited"
  },
  "specialInstructions": "Patient prefers female caregiver"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "bookingNumber": "BK20251016001",
  "booking": {
    "id": 123,
    "bookingNumber": "BK20251016001",
    "serviceName": "Elderly Care",
    "totalAmount": 1250.00,
    "status": "PENDING",
    "createdAt": "2025-10-16T10:30:00"
  }
}
```

#### GET /api/bookings/user/{userId}
**Description:** Get user's booking history  
**Parameters:**
- `userId`: User ID

**Response:**
```json
[
  {
    "id": 123,
    "bookingNumber": "BK20251016001",
    "serviceName": "Elderly Care",
    "status": "PENDING",
    "totalAmount": 1250.00,
    "preferredDate": "2025-10-20",
    "createdAt": "2025-10-16T10:30:00"
  }
]
```

#### GET /api/bookings/{bookingId}
**Description:** Get detailed booking information  
**Parameters:**
- `bookingId`: Booking ID

**Response:**
```json
{
  "id": 123,
  "bookingNumber": "BK20251016001",
  "serviceName": "Elderly Care",
  "userName": "John Doe",
  "phone": "8357028350",
  "fullAddress": "Flat 603, Shalimar Township, Indore",
  "status": "PENDING",
  "totalAmount": 1250.00,
  "subServices": [
    {
      "subServiceName": "Medication Management",
      "price": 150.00
    },
    {
      "subServiceName": "Meal Preparation", 
      "price": 200.00
    }
  ],
  "formalityData": [
    {
      "fieldName": "patient_age",
      "fieldLabel": "Patient Age",
      "fieldValue": "75"
    }
  ]
}
```

#### PUT /api/bookings/{bookingId}/status
**Description:** Update booking status  
**Request Body:**
```json
{
  "status": "CONFIRMED",
  "statusReason": "Worker assigned and confirmed"
}
```

#### PUT /api/bookings/{bookingId}/assign
**Description:** Assign worker to booking  
**Request Body:**
```json
{
  "workerId": 456,
  "assignmentNotes": "Experienced with elderly care"
}
```

#### POST /api/bookings/{bookingId}/rate
**Description:** Rate completed booking  
**Request Body:**
```json
{
  "rating": 4.5,
  "feedback": "Excellent service, very professional"
}
```

---

## 🗄️ Database Schema Reference

### Core Tables

#### services
```sql
id, service_name, service_code, description, base_price, 
is_active, display_order, created_at, updated_at, is_deleted
```

#### sub_services
```sql
id, service_id, sub_service_name, description, additional_price,
is_active, display_order, created_at, updated_at
```

#### service_formalities
```sql
id, service_id, formality_type, field_name, field_label, field_type,
is_required, options, placeholder, validation_rules, help_text,
display_order, created_at, is_deleted
```

#### bookings
```sql
id, booking_number, user_id, service_id, service_name, service_code,
user_name, user_email, phone, alternate_phone, full_address, landmark,
city, state, pincode, location_lat, location_lng, preferred_date,
preferred_time, preferred_time_slot, urgency, base_amount,
additional_charges, total_amount, status, assigned_worker_id,
worker_name, subservices_count, subservices_summary, formality_summary,
payment_status, rating, feedback, special_instructions, created_at,
updated_at, completed_at, cancelled_at
```

#### booking_sub_services
```sql
id, booking_id, sub_service_id, sub_service_name, quantity, price, created_at
```

#### booking_formality_data
```sql
id, booking_id, formality_id, field_name, field_label, field_value, created_at
```

### Database Views

#### v_booking_list
Optimized view for booking listings with essential information.

#### v_booking_details
Complete booking information with related data.

#### v_service_statistics
Service performance metrics and statistics.

#### v_user_booking_summary
User booking history and preferences.

#### v_worker_performance
Worker performance metrics and ratings.

---

## 🔧 Configuration

### Backend Configuration (application.properties)

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/needstation
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Flyway Configuration
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true

# Server Configuration
server.port=8080
server.servlet.context-path=/

# CORS Configuration
cors.allowed-origins=http://localhost:3000
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
```

### Frontend Configuration

#### Environment Variables (.env)
```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_ENVIRONMENT=development
```

#### API Configuration (bookingApi.js)
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const getServiceConfiguration = async (serviceCode) => {
  const response = await fetch(`${API_BASE_URL}/api/services/${serviceCode}`);
  if (!response.ok) throw new Error('Failed to fetch service configuration');
  return response.json();
};
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Backend Won't Start
**Error:** `Failed to configure a DataSource`  
**Solution:** 
- Verify MySQL is running
- Check database credentials in application.properties
- Ensure database exists: `CREATE DATABASE needstation;`

#### 2. Migrations Fail
**Error:** `Migration checksum mismatch`  
**Solution:**
```sql
-- Reset Flyway metadata
DELETE FROM flyway_schema_history WHERE version >= '7';
```

#### 3. API Calls Fail
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`  
**Solution:**
- Verify CORS configuration in backend
- Check API_BASE_URL in frontend

#### 4. Booking Creation Fails
**Error:** `Service not found` or `User not found`  
**Solution:**
- Ensure user exists in database
- Verify service ID is correct
- Check foreign key constraints

### Debug Commands

#### Check Database Status
```sql
-- Verify migrations
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC;

-- Check data
SELECT COUNT(*) FROM services;
SELECT COUNT(*) FROM sub_services;
SELECT COUNT(*) FROM service_formalities;

-- Recent bookings
SELECT id, booking_number, service_name, status, created_at 
FROM bookings ORDER BY created_at DESC LIMIT 5;
```

#### Check API Health
```bash
# Health check
curl http://localhost:8080/actuator/health

# Service endpoint
curl http://localhost:8080/api/services

# Specific service
curl http://localhost:8080/api/services/ELDERLY_CARE
```

---

## 📈 Performance Optimization

### Database Optimizations
1. **Indexes:** All foreign keys and frequently queried columns are indexed
2. **Views:** Pre-computed views for complex queries
3. **Triggers:** Automatic denormalization for read performance
4. **Connection Pooling:** HikariCP for efficient connection management

### API Optimizations
1. **Caching:** Service configurations cached for 1 hour
2. **Pagination:** Large result sets are paginated
3. **Compression:** GZIP compression enabled
4. **Async Processing:** Heavy operations run asynchronously

### Frontend Optimizations
1. **Code Splitting:** Lazy loading of components
2. **API Caching:** Service configs cached in memory
3. **Debouncing:** Search inputs debounced
4. **Memoization:** Expensive calculations memoized

---

## 🔒 Security Considerations

### Backend Security
1. **Input Validation:** All inputs validated and sanitized
2. **SQL Injection Prevention:** Parameterized queries only
3. **Authentication:** JWT-based authentication
4. **Authorization:** Role-based access control
5. **Rate Limiting:** API rate limiting implemented

### Frontend Security
1. **XSS Prevention:** All user inputs escaped
2. **CSRF Protection:** CSRF tokens for state-changing operations
3. **Secure Storage:** Sensitive data in secure storage only
4. **HTTPS:** All production traffic over HTTPS

---

## 📚 Additional Resources

### Documentation Links
- [Architecture Overview](../01-architecture/BOOKING_SYSTEM_ARCHITECTURE.md)
- [Implementation Progress](../02-implementation/IMPLEMENTATION_PROGRESS.md)
- [Database Schema](../04-database/DATABASE_SCHEMA.md)
- [Feature Documentation](../03-features/)

### External Resources
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Flyway Documentation](https://flywaydb.org/documentation/)

---

**Last Updated:** October 16, 2025  
**Version:** 2.0  
**Support:** development-team@needstation.com
