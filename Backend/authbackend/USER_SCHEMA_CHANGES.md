# User Table Schema Changes

## Current User Table Fields (KEEP AS IS)
```sql
id                  BIGINT AI PK
username            VARCHAR(255)
email               VARCHAR(255)
password            VARCHAR(255)
full_name           VARCHAR(255)
first_name          VARCHAR(255)
last_name           VARCHAR(255)
contact_number      VARCHAR(255)
alternate_contact   VARCHAR(255)
address             TEXT
landmark            VARCHAR(255)
location_address    VARCHAR(255)
location_lat        DOUBLE
location_lng        DOUBLE
pincode             VARCHAR(255)
preferred_date      VARCHAR(255)
preferred_time      VARCHAR(255)
work_details        TEXT
auth_provider       VARCHAR(255)
user_role           VARCHAR(255)
is_verified         BIT(1)
```

## New Fields to ADD (21 fields)
```sql
-- Personal Information
date_of_birth                DATE
gender                       ENUM('male', 'female', 'other', 'prefer_not_to_say')
profile_image_url            VARCHAR(500)

-- Structured Address
address_line1                VARCHAR(255)
address_line2                VARCHAR(255)
city                         VARCHAR(100)
state                        VARCHAR(100)

-- Healthcare Information
emergency_contact            VARCHAR(255)
emergency_phone              VARCHAR(20)
medical_conditions           TEXT
allergies                    TEXT

-- Service Preferences
preferred_language           VARCHAR(10) DEFAULT 'en'
preferred_service_time       ENUM('morning', 'afternoon', 'evening', 'night', 'flexible') DEFAULT 'flexible'
special_instructions         TEXT

-- Enhanced Verification
email_verified               BOOLEAN DEFAULT FALSE
phone_verified               BOOLEAN DEFAULT FALSE
account_status               ENUM('active', 'suspended', 'deleted') DEFAULT 'active'

-- Settings Storage
notification_preferences     JSON
privacy_settings             JSON

-- Timestamps
created_at                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
last_login_at                TIMESTAMP NULL
```

## Single ALTER TABLE Command
```sql
ALTER TABLE users 
ADD COLUMN date_of_birth DATE,
ADD COLUMN gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
ADD COLUMN profile_image_url VARCHAR(500),
ADD COLUMN address_line1 VARCHAR(255),
ADD COLUMN address_line2 VARCHAR(255),
ADD COLUMN city VARCHAR(100),
ADD COLUMN state VARCHAR(100),
ADD COLUMN emergency_contact VARCHAR(255),
ADD COLUMN emergency_phone VARCHAR(20),
ADD COLUMN medical_conditions TEXT,
ADD COLUMN allergies TEXT,
ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'en',
ADD COLUMN preferred_service_time ENUM('morning', 'afternoon', 'evening', 'night', 'flexible') DEFAULT 'flexible',
ADD COLUMN special_instructions TEXT,
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN account_status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
ADD COLUMN notification_preferences JSON,
ADD COLUMN privacy_settings JSON,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN last_login_at TIMESTAMP NULL;
```

## Summary
- **Existing Fields**: 21 fields (NO CHANGES)
- **New Fields**: 21 fields (ALL ADDITIONS)
- **Total Fields After**: 42 fields
- **Breaking Changes**: NONE (all additions are nullable or have defaults)
