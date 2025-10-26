# Service Image Management Setup

## ✅ Backend Changes Complete

### 1. Database Schema Updates

Added to `services` table:
```sql
ALTER TABLE services ADD COLUMN category VARCHAR(100);
ALTER TABLE services ADD COLUMN image_url VARCHAR(500);
ALTER TABLE services ADD COLUMN minicard_image_url VARCHAR(500);
```

### 2. Entity Updates

**Service.java** - Added fields:
- `category` - Service category (e.g., "Elder Care", "Diabetes Care")
- `imageUrl` - Main service image URL (Cloudinary)
- `minicardImageUrl` - Minicard image URL (Cloudinary)

### 3. Repository Updates

**ServiceRepository.java** - Added methods:
- `findByCategoryActive(String category)` - Find services by category
- `findByServiceNameIn(List<String> serviceNames)` - Find multiple services by names

### 4. DTO Updates

**ServiceConfigDTO.ServiceDTO** - Added fields:
- `category`
- `imageUrl`
- `minicardImageUrl`
- `isActive`

### 5. Service Layer Updates

**ServiceService.java** - Updated methods:
- `getServiceById(Long id)` - Returns DTO with image URLs
- `getServiceByName(String name)` - NEW - Returns DTO with image URLs
- `getAllActiveServices()` - Returns DTOs with image URLs

### 6. Controller Updates

**ServiceController.java** - Added endpoints:
- `GET /api/services/id/{id}` - Get service by ID
- `GET /api/services/name/{serviceName}` - Get service by name

---

## 📋 Next Steps

### Step 1: Run Database Migration
```sql
ALTER TABLE services ADD COLUMN category VARCHAR(100);
ALTER TABLE services ADD COLUMN image_url VARCHAR(500);
ALTER TABLE services ADD COLUMN minicard_image_url VARCHAR(500);
```

### Step 2: Upload Images to Cloudinary
Upload all minicard images from:
`Frontend/Need_Station_MP-main/src/assets/images/services/minicards/`

Organize by category folders:
- elder care/
- bedridden patient care/
- caretaker at home/
- diabetes care/
- health check up services/
- mother and baby care/
- nursing care/
- paralysis care/
- parkinsons cae/
- pathology care/
- physiotherapy/
- post surgery care/
- security guard/

### Step 3: Populate Database
Insert services with Cloudinary URLs:

```sql
-- Example
INSERT INTO services (service_name, category, minicard_image_url, is_active) VALUES
('Personal Care', 'Elder Care', 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/needstation/minicards/elder_care/ec2_personal.jpg', true),
('Companion Care', 'Elder Care', 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/needstation/minicards/elder_care/ec1_companion.jpg', true),
-- ... add all 52 services
```

### Step 4: Update Frontend
Replace hardcoded image mapping in `CartNew.jsx` with API call:

```javascript
// OLD: Hardcoded mapping
const getServiceImage = (serviceName) => { ... }

// NEW: Fetch from API
useEffect(() => {
  const fetchServices = async () => {
    const response = await axios.get(`${API_URL}/services`);
    setServicesMap(response.data.services);
  };
  fetchServices();
}, []);
```

---

## 🎯 Benefits

1. **No code changes** for new services
2. **Dynamic updates** - Admin can add services via API
3. **Centralized** - One source of truth
4. **Scalable** - Easy to add hundreds of services
5. **Cloudinary CDN** - Fast image delivery worldwide

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Get all active services with images |
| GET | `/api/services/id/{id}` | Get service by ID |
| GET | `/api/services/name/{serviceName}` | Get service by name |
| GET | `/api/services/{serviceCode}` | Get service config (existing) |

---

## 📝 Service Categories (13 total)

1. Elder Care (4 services)
2. Bedridden Patient Care (4 services)
3. Caretaker at Home (4 services)
4. Diabetes Care (4 services)
5. Health Checkup (4 services)
6. Mother and Baby Care (4 services)
7. Nursing Care (4 services)
8. Paralysis Care (4 services)
9. Parkinsons Care (3 services)
10. Pathology Care (4 services)
11. Physiotherapy (4 services)
12. Post Surgery Care (4 services)
13. Security Guard (4 services)

**Total: 51 services**
