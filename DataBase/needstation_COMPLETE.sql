-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: needstation
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `needstation`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `needstation` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `needstation`;

--
-- Table structure for table `booking_formality_data`
--

DROP TABLE IF EXISTS `booking_formality_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_formality_data` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `field_label` varchar(200) DEFAULT NULL,
  `field_name` varchar(100) DEFAULT NULL,
  `field_value` text NOT NULL,
  `formality_id` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `booking_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6i9q9386i7ix01pjfmpce7fww` (`booking_id`),
  CONSTRAINT `FK6i9q9386i7ix01pjfmpce7fww` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_formality_data`
--

LOCK TABLES `booking_formality_data` WRITE;
/*!40000 ALTER TABLE `booking_formality_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_formality_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_sub_services`
--

DROP TABLE IF EXISTS `booking_sub_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_sub_services` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int DEFAULT NULL,
  `sub_service_id` bigint NOT NULL,
  `sub_service_name` varchar(100) DEFAULT NULL,
  `booking_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKumm4kmeqcrqufdb79x2epwmp` (`booking_id`),
  CONSTRAINT `FKumm4kmeqcrqufdb79x2epwmp` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_sub_services`
--

LOCK TABLES `booking_sub_services` WRITE;
/*!40000 ALTER TABLE `booking_sub_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_sub_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `alternate_phone` varchar(255) DEFAULT NULL,
  `assigned_worker_id` bigint DEFAULT NULL,
  `booking_id` varchar(255) DEFAULT NULL,
  `cancellation_reason` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(255) DEFAULT NULL,
  `estimated_price` double DEFAULT NULL,
  `final_price` double DEFAULT NULL,
  `full_address` text,
  `landmark` varchar(255) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `preferred_date` varchar(255) DEFAULT NULL,
  `preferred_time` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `review` text,
  `scheduled_at` datetime(6) DEFAULT NULL,
  `service_category` varchar(255) DEFAULT NULL,
  `service_details` text,
  `service_name` varchar(255) NOT NULL,
  `special_instructions` text,
  `state` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'PENDING',
  `updated_at` datetime(6) DEFAULT NULL,
  `urgency` varchar(255) DEFAULT NULL,
  `worker_name` varchar(255) DEFAULT NULL,
  `worker_phone` varchar(255) DEFAULT NULL,
  `additional_charges` decimal(10,2) DEFAULT NULL,
  `admin_notes` text,
  `assigned_worker_name` varchar(200) DEFAULT NULL,
  `base_amount` decimal(10,2) DEFAULT NULL,
  `booking_number` varchar(50) NOT NULL,
  `cancelled_at` datetime(6) DEFAULT NULL,
  `cancelled_by` bigint DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `customer_feedback` text,
  `customer_rating` int DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `formality_summary` text,
  `location_address` text,
  `location_lat` decimal(10,8) DEFAULT NULL,
  `location_lng` decimal(11,8) DEFAULT NULL,
  `phone` varchar(15) NOT NULL,
  `preferred_time_slot` varchar(50) DEFAULT NULL,
  `service_code` varchar(50) DEFAULT NULL,
  `service_id` bigint NOT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `subservices_count` int DEFAULT NULL,
  `subservices_summary` text,
  `total_amount` decimal(10,2) NOT NULL,
  `quotation_amount` decimal(10,2) DEFAULT NULL,
  `quotation_details` text,
  `quotation_provided_at` datetime DEFAULT NULL,
  `quotation_status` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `user_name` varchar(200) DEFAULT NULL,
  `formality_data_json` json DEFAULT NULL COMMENT 'Service-specific form data from Step 2',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKe2b8ksk9hptq6l8msdvoo6anv` (`booking_number`),
  UNIQUE KEY `UKe0p6k9xpku6j2m89duwxuqw11` (`booking_id`),
  KEY `idx_bookings_quotation_status` (`quotation_status`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (11,NULL,8,NULL,NULL,'Indore',NULL,'2025-10-31 12:45:20.083608',NULL,NULL,NULL,NULL,NULL,'Flat no 603, Shalimar Township',NULL,NULL,NULL,NULL,'PAID','452010','2025-11-01',NULL,NULL,NULL,'2025-10-31 12:45:34.018147',NULL,NULL,'Personal Care',NULL,'Madhya Pradesh','PAYMENT_COMPLETED','2025-10-31 13:05:54.399074','NORMAL',NULL,NULL,0.00,NULL,'Ashwin Soni',2000.00,'BK-20251031-00002',NULL,NULL,12,NULL,NULL,NULL,0.00,'{\"patient_age\":\"19\",\"patient_gender\":\"male\",\"mobility_level\":\"fully_mobile\",\"care_activities\":\"swq\",\"care_hours\":\"8\",\"medical_conditions\":\"swq\",\"special_requirements\":\"aqw\"}','Indore City, Indore, Juni Indore Tahsil, इन्दौर ज़िला, Madhya Pradesh, 452001, India',22.73563706,75.85623451,'8357028350','afternoon','PERSONAL_CARE',23,NULL,0,NULL,2000.00,2000.00,'Standard service quotation for Personal Care','2025-10-31 12:45:34','PROVIDED','pay_Ra5fOfM6YjcVtJ',NULL,'ashwinrmcf@gmail.com',12,'Ashwin Soni','{\"care_hours\": \"8\", \"patient_age\": \"19\", \"mobility_level\": \"fully_mobile\", \"patient_gender\": \"male\", \"care_activities\": \"swq\", \"medical_conditions\": \"swq\", \"special_requirements\": \"aqw\"}'),(12,NULL,8,NULL,NULL,'Indore',NULL,'2025-10-31 12:57:21.624719',NULL,NULL,NULL,NULL,NULL,'Flat no 603, Shalimar Township',NULL,NULL,NULL,NULL,'PAID','452010','2025-11-02',NULL,NULL,NULL,'2025-10-31 12:57:40.328401',NULL,NULL,'Companion Care',NULL,'Madhya Pradesh','PAYMENT_COMPLETED','2025-10-31 12:58:30.884803','NORMAL',NULL,NULL,0.00,NULL,'Ashwin Soni',1800.00,'BK-20251031-00003',NULL,NULL,12,NULL,NULL,NULL,0.00,'{\"patient_age\":\"31\",\"patient_gender\":\"male\",\"health_status\":\"fair\",\"interests_hobbies\":\"Swq\",\"companionship_hours\":\"8\",\"communication_ability\":\"limited_verbal\",\"special_requirements\":\"mon\"}','Indore City, Indore, Juni Indore Tahsil, इन्दौर ज़िला, Madhya Pradesh, 452001, India',22.73563706,75.85623451,'8357028350','evening','COMPANION_CARE',24,NULL,0,NULL,1800.00,1800.00,'Standard service quotation for Companion Care','2025-10-31 12:57:40','PROVIDED','pay_Ra5XbEJU9L5tln',NULL,'ashwinrmcf@gmail.com',12,'Ashwin Soni','{\"patient_age\": \"31\", \"health_status\": \"fair\", \"patient_gender\": \"male\", \"interests_hobbies\": \"Swq\", \"companionship_hours\": \"8\", \"special_requirements\": \"mon\", \"communication_ability\": \"limited_verbal\"}');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_submissions`
--

DROP TABLE IF EXISTS `contact_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_submissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `admin_notes` text,
  `email` varchar(255) NOT NULL,
  `is_resolved` bit(1) NOT NULL,
  `message` text NOT NULL,
  `name` varchar(255) NOT NULL,
  `resolved_at` datetime(6) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `submitted_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_submissions`
--

LOCK TABLES `contact_submissions` WRITE;
/*!40000 ALTER TABLE `contact_submissions` DISABLE KEYS */;
INSERT INTO `contact_submissions` VALUES (1,NULL,'abhishek2405gupta@gmail.com',_binary '\0','Confidential','Abhishek Gupta',NULL,'Confidential','2025-09-12 03:26:55.959622'),(2,NULL,'ashwinrmcf@gmail.com',_binary '\0','danger','Ashwin Soni',NULL,'Facing Problems','2025-09-12 14:11:41.562147'),(3,NULL,'navneetchauhan948@gmail.com',_binary '\0','message from muskan','Navneet Chauhan',NULL,'help','2025-09-12 14:13:48.991429'),(4,NULL,'ashwinrmcf@gmail.com',_binary '\0','heY MAN','Ashwin Soni',NULL,'Having A pROBLEM','2025-09-19 13:51:33.121004');
/*!40000 ALTER TABLE `contact_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_otps`
--

DROP TABLE IF EXISTS `email_otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_otps` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attempts` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `is_verified` bit(1) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_otps`
--

LOCK TABLES `email_otps` WRITE;
/*!40000 ALTER TABLE `email_otps` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','<< Flyway Baseline >>','BASELINE','<< Flyway Baseline >>',NULL,'root','2025-09-03 23:22:14',0,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_verification`
--

DROP TABLE IF EXISTS `otp_verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_verification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `otp` varchar(255) NOT NULL,
  `otp_type` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `used` bit(1) NOT NULL,
  `verified_at` datetime(6) DEFAULT NULL,
  `worker_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verification`
--

LOCK TABLES `otp_verification` WRITE;
/*!40000 ALTER TABLE `otp_verification` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp_verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `payment_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `platform_fee` decimal(10,2) DEFAULT '0.00',
  `gst_amount` decimal(10,2) DEFAULT '0.00',
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `promo_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_gateway` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_order_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_payment_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `razorpay_signature` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_initiated_at` datetime DEFAULT NULL,
  `payment_completed_at` datetime DEFAULT NULL,
  `payment_failed_at` datetime DEFAULT NULL,
  `failure_reason` text COLLATE utf8mb4_unicode_ci,
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `refund_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_initiated_at` datetime DEFAULT NULL,
  `refund_completed_at` datetime DEFAULT NULL,
  `refund_transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_reason` text COLLATE utf8mb4_unicode_ci,
  `customer_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_description` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_number` (`payment_number`),
  KEY `idx_booking_id` (`booking_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_payment_number` (`payment_number`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_transaction_id` (`transaction_id`),
  KEY `idx_razorpay_order_id` (`razorpay_order_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores all payment transactions with reference to bookings';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,12,12,'PAY-20251031-00001',1800.00,49.00,333.00,0.00,'',2182.00,'RAZORPAY','RAZORPAY','COMPLETED','pay_Ra5XbEJU9L5tln','order_Ra5XPEkNwKhV2B','pay_Ra5XbEJU9L5tln','3482273aac98f3863f06f04fcee1185181ae9c4e01bb1de3df0576e6144b8307','2025-10-31 12:58:31','2025-10-31 12:58:31',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ashwin Soni','ashwinrmcf@gmail.com','8357028350','Payment for Companion Care',NULL,NULL,NULL,'2025-10-31 12:58:31','2025-10-31 12:58:31'),(2,11,12,'PAY-20251031-00002',2000.00,49.00,369.00,0.00,'',2418.00,'RAZORPAY','RAZORPAY','COMPLETED','pay_Ra5fOfM6YjcVtJ','order_Ra5fBwWKZfOlhq','pay_Ra5fOfM6YjcVtJ','e51b7b3441788ce6b6ba7b207b4fc76f5ff08ca027737c0c8301e21295408aed','2025-10-31 13:05:54','2025-10-31 13:05:54',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ashwin Soni','ashwinrmcf@gmail.com','8357028350','Payment for Personal Care',NULL,NULL,NULL,'2025-10-31 13:05:54','2025-10-31 13:05:54');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_formalities`
--

DROP TABLE IF EXISTS `service_formalities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_formalities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `display_order` int DEFAULT NULL,
  `field_label` varchar(200) NOT NULL,
  `field_name` varchar(100) NOT NULL,
  `field_type` varchar(50) NOT NULL,
  `formality_type` varchar(50) NOT NULL,
  `help_text` varchar(500) DEFAULT NULL,
  `is_required` bit(1) DEFAULT NULL,
  `options` text,
  `placeholder` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `validation_rules` text,
  `service_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKif3f23f8jj5dy1ukbbjga4pdr` (`service_id`),
  CONSTRAINT `FKif3f23f8jj5dy1ukbbjga4pdr` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_formalities`
--

LOCK TABLES `service_formalities` WRITE;
/*!40000 ALTER TABLE `service_formalities` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_formalities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `base_price` decimal(10,2) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `minicard_image_url` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `description` text,
  `is_active` bit(1) DEFAULT NULL,
  `service_code` varchar(50) NOT NULL,
  `service_name` varchar(100) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKrm9rfu0ekvjb9y1ff8blnaf0i` (`service_code`),
  UNIQUE KEY `UK38twoss73rtux07w58qp200r0` (`service_name`),
  KEY `idx_services_category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (23,2000.00,'Elder Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/elder_care/ec2_personal.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Comprehensive personal care services for elderly',_binary '','PERSONAL_CARE','Personal Care','2025-10-26 17:05:49.000000',NULL),(24,1800.00,'Elder Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/elder_care/ec1_companion.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Companionship and emotional support for seniors',_binary '','COMPANION_CARE','Companion Care','2025-10-26 17:05:49.000000',NULL),(25,2200.00,'Elder Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/elder_care/ec4_respite.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Temporary relief care for family caregivers',_binary '','RESPITE_CARE','Respite Care','2025-10-26 17:05:49.000000',NULL),(26,2500.00,'Elder Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/elder_care/ec3_dementia.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Specialized care for dementia and Alzheimer patients',_binary '','DEMENTIA_CARE','Dementia Care','2025-10-26 17:05:49.000000',NULL),(27,2500.00,'Bedridden Patient Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/bedridden_patient_care/bpc1_complete_bed_care.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Full care for bedridden patients',_binary '','COMPLETE_BED_CARE','Complete Bed Care','2025-10-26 17:05:49.000000',NULL),(28,2800.00,'Bedridden Patient Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/bedridden_patient_care/bpc2_stroke_patient.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Specialized care for stroke patients',_binary '','STROKE_PATIENT_CARE','Stroke Patient Care','2025-10-26 17:05:49.000000',NULL),(29,3500.00,'Bedridden Patient Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/bedridden_patient_care/bpc3_coma.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Intensive care for coma patients',_binary '','COMA_CARE','Coma Care','2025-10-26 17:05:49.000000',NULL),(30,3000.00,'Bedridden Patient Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/bedridden_patient_care/bpc4_palliativecare.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Comfort care for terminally ill patients',_binary '','PALLIATIVE_CARE','Palliative Care','2025-10-26 17:05:49.000000',NULL),(31,15000.00,'Caretaker at Home',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/caretaker_at_home/cah1_live_in_caretaker.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'24/7 live-in caretaker services',_binary '','LIVE_IN_CARETAKER','Live-in Caretaker','2025-10-26 17:05:49.000000',NULL),(32,8000.00,'Caretaker at Home',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/caretaker_at_home/cah2_part_time_caretaker.webp','2025-10-26 17:05:49.000000',NULL,NULL,'Part-time caretaker for daily tasks',_binary '','PART_TIME_CARETAKER','Part-time Caretaker','2025-10-26 17:05:49.000000',NULL),(33,10000.00,'Caretaker at Home',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/caretaker_at_home/cah3_cook.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Professional cooking services at home',_binary '','COOK','Cook','2025-10-26 17:05:49.000000',NULL),(34,12000.00,'Caretaker at Home',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/caretaker_at_home/cah4_nanny.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Professional nanny for child care',_binary '','NANNY','Nanny','2025-10-26 17:05:49.000000',NULL),(35,1800.00,'Diabetes Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/diabetes_care/dm_type_1.webp','2025-10-26 17:05:49.000000',NULL,NULL,'Care and management for Type 1 diabetes',_binary '','TYPE1_DIABETES','Type 1 Diabetes','2025-10-26 17:05:49.000000',NULL),(36,1500.00,'Diabetes Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/diabetes_care/db2_type2.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Care and management for Type 2 diabetes',_binary '','TYPE2_DIABETES','Type 2 Diabetes','2025-10-26 17:05:49.000000',NULL),(37,2000.00,'Diabetes Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/diabetes_care/dm3_gestational.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Diabetes care during pregnancy',_binary '','GESTATIONAL_DIABETES','Gestational Diabetes','2025-10-26 17:05:49.000000',NULL),(38,2500.00,'Diabetes Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/diabetes_care/dm4_complication.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Management of diabetes complications',_binary '','DIABETES_COMPLICATION','Diabetes Complication','2025-10-26 17:05:49.000000',NULL),(39,1500.00,'Health Checkup',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/health_check_up_services/hcs1_basic.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Basic health screening package',_binary '','BASIC_HEALTH_CHECKUP','Basic Health Checkup','2025-10-26 17:05:49.000000',NULL),(40,3500.00,'Health Checkup',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/health_check_up_services/hcs2_comprehensive_health_checkup.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Complete health checkup package',_binary '','COMPREHENSIVE_HEALTH_CHECKUP','Comprehensive Health Checkup','2025-10-26 17:05:49.000000',NULL),(41,2500.00,'Health Checkup',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/health_check_up_services/hcs3_senior_citizen.png','2025-10-26 17:05:49.000000',NULL,NULL,'Specialized health checkup for seniors',_binary '','SENIOR_CITIZEN_HEALTH_CHECKUP','Senior Citizen Health Checkup','2025-10-26 17:05:49.000000',NULL),(42,2800.00,'Health Checkup',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/health_check_up_services/hcs4_women_health_checkup.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Comprehensive women health screening',_binary '','WOMEN_HEALTH_CHECKUP','Women Health Checkup','2025-10-26 17:05:49.000000',NULL),(43,2000.00,'Mother and Baby Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/mother_and_baby_care/mbc_newborn_care.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Professional newborn care services',_binary '','NEWBORN_CARE','Newborn Care','2025-10-26 17:05:49.000000',NULL),(44,2500.00,'Mother and Baby Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/mother_and_baby_care/mbc_postnatal.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Postnatal care for mother and baby',_binary '','POSTNATAL_CARE','Postnatal Care','2025-10-26 17:05:49.000000',NULL),(45,1200.00,'Mother and Baby Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/mother_and_baby_care/mbc_baby_massage_and_care.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Baby massage and wellness care',_binary '','BABY_MASSAGE_CARE','Baby Massage and Care','2025-10-26 17:05:49.000000',NULL),(46,3500.00,'Mother and Baby Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/mother_and_baby_care/mbc_twins_baby_care.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Specialized care for twins',_binary '','TWINS_BABY_CARE','Twins Baby Care','2025-10-26 17:05:49.000000',NULL),(47,2000.00,'Nursing Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/nursing_care/nc1_general_nursing.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'General nursing care at home',_binary '','GENERAL_NURSING','General Nursing','2025-10-26 17:05:49.000000',NULL),(48,3500.00,'Nursing Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/nursing_care/nc2_icu_trained.jpeg','2025-10-26 17:05:49.000000',NULL,NULL,'ICU trained nursing care',_binary '','ICU_TRAINED_NURSE','ICU Trained Nurse','2025-10-26 17:05:49.000000',NULL),(49,1800.00,'Nursing Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/nursing_care/nc3_wound_care.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Professional wound care and dressing',_binary '','WOUND_CARE','Wound Care','2025-10-26 17:05:49.000000',NULL),(50,2500.00,'Nursing Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/nursing_care/nc4_pediatric.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Specialized pediatric nursing care',_binary '','PEDIATRIC_NURSING','Pediatric Nursing','2025-10-26 17:05:49.000000',NULL),(51,2500.00,'Paralysis Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/paralysis_care/parac1_hemiplegia_care.webp','2025-10-26 17:05:49.000000',NULL,NULL,'Care for one-sided paralysis',_binary '','HEMIPLEGIA_CARE','Hemiplegia Care','2025-10-26 17:05:49.000000',NULL),(52,3000.00,'Paralysis Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/paralysis_care/parac2_paraphlegia.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Care for lower body paralysis',_binary '','PARAPHLEGIA_CARE','Paraphlegia Care','2025-10-26 17:05:49.000000',NULL),(53,4000.00,'Paralysis Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/paralysis_care/parac3_quadriplegia.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Care for full body paralysis',_binary '','QUADRIPLEGIA_CARE','Quadriplegia Care','2025-10-26 17:05:49.000000',NULL),(54,2000.00,'Paralysis Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/paralysis_care/parac4_facial_paralysis.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Care for facial paralysis',_binary '','FACIAL_PARALYSIS_CARE','Facial Paralysis Care','2025-10-26 17:05:49.000000',NULL),(55,2200.00,'Parkinsons Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/parkinsons_cae/pc1_early_stage.jfif','2025-10-26 17:05:49.000000',NULL,NULL,'Care for early stage Parkinsons',_binary '','EARLY_STAGE_PARKINSONS','Early Stage Parkinsons','2025-10-26 17:05:49.000000',NULL),(56,3500.00,'Parkinsons Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/parkinsons_cae/pc2_advanced_stage.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Care for advanced Parkinsons',_binary '','ADVANCED_STAGE_PARKINSONS','Advanced Stage Parkinsons','2025-10-26 17:05:49.000000',NULL),(57,2800.00,'Parkinsons Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/parkinsons_cae/pc3_therapy_support.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Therapy and support for Parkinsons',_binary '','PARKINSONS_THERAPY_SUPPORT','Parkinsons Therapy Support','2025-10-26 17:05:49.000000',NULL),(58,500.00,'Pathology Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/pathology_care/pathc1_home_sample.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Blood and sample collection at home',_binary '','HOME_SAMPLE_COLLECTION','Home Sample Collection','2025-10-26 17:05:49.000000',NULL),(59,1500.00,'Pathology Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/pathology_care/pathc2_diagnostic_services.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Complete diagnostic services',_binary '','DIAGNOSTIC_SERVICES','Diagnostic Services','2025-10-26 17:05:49.000000',NULL),(60,2000.00,'Pathology Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/pathology_care/pathc3_regular_monitoring.webp','2025-10-26 17:05:49.000000',NULL,NULL,'Regular health monitoring services',_binary '','REGULAR_MONITORING','Regular Monitoring','2025-10-26 17:05:49.000000',NULL),(61,3000.00,'Pathology Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/pathology_care/pathc4_corporate_health.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Corporate health screening package',_binary '','CORPORATE_HEALTH_PACKAGE','Corporate Health Package','2025-10-26 17:05:49.000000',NULL),(62,1500.00,'Physiotherapy',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/physiotherapy/p1_orthopedic.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Physiotherapy for bone and joint issues',_binary '','ORTHOPEDIC_PHYSIOTHERAPY','Orthopedic Physiotherapy','2025-10-26 17:05:49.000000',NULL),(63,2000.00,'Physiotherapy',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/physiotherapy/p2_neurological.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Physiotherapy for neurological conditions',_binary '','NEUROLOGICAL_PHYSIOTHERAPY','Neurological Physiotherapy','2025-10-26 17:05:49.000000',NULL),(64,1800.00,'Physiotherapy',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/physiotherapy/p3_pediatric.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Physiotherapy for children',_binary '','PEDIATRIC_PHYSIOTHERAPY','Pediatric Physiotherapy','2025-10-26 17:05:49.000000',NULL),(65,1600.00,'Physiotherapy',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/physiotherapy/p4_geriatric.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Physiotherapy for elderly patients',_binary '','GERIATRIC_PHYSIOTHERAPY','Geriatric Physiotherapy','2025-10-26 17:05:49.000000',NULL),(66,3500.00,'Post Surgery Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/post_surgery_care/ps1_cardiac_surgery.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Post-operative care for cardiac surgery',_binary '','CARDIAC_SURGERY_CARE','Cardiac Surgery Care','2025-10-26 17:05:49.000000',NULL),(67,2500.00,'Post Surgery Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/post_surgery_care/ps2_orthopedic.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Post-operative care for orthopedic surgery',_binary '','ORTHOPEDIC_SURGERY_CARE','Orthopedic Surgery Care','2025-10-26 17:05:49.000000',NULL),(68,2800.00,'Post Surgery Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/post_surgery_care/ps3_abdominal_surgery_care.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Post-operative care for abdominal surgery',_binary '','ABDOMINAL_SURGERY_CARE','Abdominal Surgery Care','2025-10-26 17:05:49.000000',NULL),(69,4000.00,'Post Surgery Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/post_surgery_care/ps4_neuro_surgery_care.webp','2025-10-26 17:05:49.000000',NULL,NULL,'Post-operative care for neuro surgery',_binary '','NEURO_SURGERY_CARE','Neuro Surgery Care','2025-10-26 17:05:49.000000',NULL),(70,12000.00,'Security Guard',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/security_guard/hsg_home_sec.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Residential security guard services',_binary '','HOME_SECURITY','Home Security','2025-10-26 17:05:49.000000',NULL),(71,15000.00,'Security Guard',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/security_guard/hsg_corporate_security.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Corporate security services',_binary '','CORPORATE_SECURITY','Corporate Security','2025-10-26 17:05:49.000000',NULL),(72,8000.00,'Security Guard',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/security_guard/hsg_event_security.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Event security management',_binary '','EVENT_SECURITY','Event Security','2025-10-26 17:05:49.000000',NULL),(73,10000.00,'Security Guard',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/security_guard/hsg_night_watchman.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Night watchman services',_binary '','NIGHT_WATCHMAN','Night Watchman','2025-10-26 17:05:49.000000',NULL),(74,2500.00,'Parkinsons Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/parkinsons_cae/pc4_family_support.jpg','2025-10-26 17:11:57.000000',NULL,NULL,'Family support and counseling for Parkinsons',_binary '','FAMILY_SUPPORT_CARE','Family Support Care','2025-10-26 17:11:57.000000',NULL);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_services`
--

DROP TABLE IF EXISTS `sub_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_services` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `additional_price` decimal(10,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `description` text,
  `display_order` int DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `sub_service_name` varchar(100) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `service_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrlmeywdka54xkqnom7d1f5ti1` (`service_id`),
  CONSTRAINT `FKrlmeywdka54xkqnom7d1f5ti1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_services`
--

LOCK TABLES `sub_services` WRITE;
/*!40000 ALTER TABLE `sub_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` text,
  `alternate_contact` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `location_address` varchar(255) DEFAULT NULL,
  `location_lat` double DEFAULT NULL,
  `location_lng` double DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `preferred_date` varchar(255) DEFAULT NULL,
  `preferred_time` varchar(255) DEFAULT NULL,
  `auth_provider` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `is_verified` bit(1) DEFAULT NULL,
  `work_details` text,
  `user_role` varchar(255) DEFAULT NULL,
  `account_status` enum('ACTIVE','DELETED','SUSPENDED') NOT NULL,
  `allergies` text,
  `city` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email_verified` bit(1) NOT NULL,
  `emergency_contact` varchar(255) DEFAULT NULL,
  `emergency_phone` varchar(20) DEFAULT NULL,
  `gender` enum('FEMALE','MALE','OTHER','PREFER_NOT_TO_SAY') DEFAULT NULL,
  `last_login_at` datetime(6) DEFAULT NULL,
  `medical_conditions` text,
  `notification_preferences` json DEFAULT NULL,
  `phone_verified` bit(1) NOT NULL,
  `preferred_language` varchar(10) NOT NULL,
  `preferred_service_time` enum('AFTERNOON','EVENING','FLEXIBLE','MORNING','NIGHT') NOT NULL,
  `privacy_settings` json DEFAULT NULL,
  `profile_image_url` varchar(500) DEFAULT NULL,
  `special_instructions` text,
  `state` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `full_address` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,NULL,NULL,NULL,'yash.sharma2484@gmail.com','Yash','Yash Sharma',NULL,'Sharma',NULL,NULL,NULL,'$2a$10$xed8hZJbML.Fw0EEatx9WeLO51B.9tPHxWXTy2N4phcHuDkOJpB6q',NULL,NULL,NULL,'GOOGLE','yash.sharma2484',_binary '',NULL,NULL,'ACTIVE',NULL,NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,NULL,NULL,_binary '\0','','AFTERNOON',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,'Flat no 603, Shalimar Township',NULL,'8357028350','ashwinrmcf@gmail.com','Ashwin','Ashwin Soni',NULL,'Soni','Indore City, Indore, Juni Indore Tahsil, इन्दौर ज़िला, Madhya Pradesh, 452001, India',22.735637061842347,75.8562345117294,NULL,'452010',NULL,NULL,'GOOGLE','ashwinrmcf@gmail.com',_binary '',NULL,NULL,'ACTIVE',NULL,NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,NULL,NULL,_binary '\0','en','FLEXIBLE',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1760346296/needstation/user_profiles/user_profile_12_1760346290707.jpg',NULL,NULL,'2025-10-12 21:42:27.311810','2025-10-15 18:43:17.605736',NULL),(13,NULL,NULL,'8357028351',NULL,'Siddharth','Siddharth Singh',NULL,'Singh',NULL,NULL,NULL,'$2a$10$SHXupyqzPcT.UeIZ0leaAOsouM1oE8L1YS4/N9iqOVkwJrtl0o5zW',NULL,NULL,NULL,'GOOGLE','user8351',_binary '',NULL,NULL,'ACTIVE',NULL,NULL,NULL,_binary '\0',NULL,NULL,NULL,NULL,NULL,NULL,_binary '\0','en','FLEXIBLE',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1760550373/needstation/user_profiles/user_profile_13_1760550365461.jpg',NULL,NULL,'2025-10-15 17:45:24.220821','2025-10-15 17:46:13.501476',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `worker`
--

DROP TABLE IF EXISTS `worker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `worker` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aadhar_number` varchar(20) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `availability` text,
  `bank_name` varchar(255) DEFAULT NULL,
  `certificate_urls` text,
  `city` varchar(100) NOT NULL,
  `current_address` varchar(255) DEFAULT NULL,
  `dob` date NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `emergency_contact_name` varchar(255) DEFAULT NULL,
  `emergency_contact_number` varchar(20) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `id_proof_url` varchar(500) DEFAULT NULL,
  `ifsc_code` varchar(255) DEFAULT NULL,
  `languages` text,
  `open_to_travel` bit(1) NOT NULL,
  `otp_attempts` int DEFAULT NULL,
  `otp_created_at` datetime(6) DEFAULT NULL,
  `otp_expires_at` datetime(6) DEFAULT NULL,
  `pan_card` varchar(255) DEFAULT NULL,
  `payment_mode` varchar(255) DEFAULT NULL,
  `permanent_address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `phone_verification_otp` varchar(255) DEFAULT NULL,
  `phone_verified` bit(1) DEFAULT NULL,
  `pincode` varchar(10) NOT NULL,
  `police_verification_status` varchar(255) DEFAULT NULL,
  `profile_image_url` varchar(500) DEFAULT NULL,
  `registration_date` date NOT NULL,
  `registration_status` varchar(255) NOT NULL,
  `selfie_with_id_url` varchar(500) DEFAULT NULL,
  `service_areas` varchar(255) DEFAULT NULL,
  `services` text,
  `upi_id` varchar(255) DEFAULT NULL,
  `verification_date` date DEFAULT NULL,
  `whatsapp_number` varchar(255) DEFAULT NULL,
  `work_type` varchar(255) DEFAULT NULL,
  `otp_verified_at` datetime(6) DEFAULT NULL,
  `agency_id` bigint NOT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `availability_status` enum('AVAILABLE','BUSY','OFFLINE') NOT NULL,
  `certifications` json DEFAULT NULL,
  `education_qualification` varchar(255) DEFAULT NULL,
  `emergency_contact_relation` varchar(100) DEFAULT NULL,
  `experience_years` int NOT NULL,
  `medical_certificate_status` enum('FAILED','NOT_REQUIRED','PENDING','VERIFIED') NOT NULL,
  `pan_number` varchar(20) DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL,
  `service_radius_km` int NOT NULL,
  `specializations` json DEFAULT NULL,
  `total_bookings` int NOT NULL,
  `worker_type` enum('CARETAKER','NURSE','PATHOLOGIST','PHYSIOTHERAPIST','SECURITY_GUARD') NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `aadhar_verified` bit(1) NOT NULL,
  `pan_verified` bit(1) NOT NULL,
  `current_latitude` decimal(10,8) DEFAULT NULL,
  `current_longitude` decimal(11,8) DEFAULT NULL,
  `last_location_update` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKa692i2kc1nl2e4pdtxrg72l8e` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worker`
--

LOCK TABLES `worker` WRITE;
/*!40000 ALTER TABLE `worker` DISABLE KEYS */;
INSERT INTO `worker` VALUES (8,'789056012912',NULL,NULL,NULL,'{\"certificate_1\":\"https://f006.backblazeb2.com/file/NeedStation/AshwinSoni_8/63cb63c3-497f-4be2-b597-b686698e00a6_1760125485583.PNG\"}','Indore','Apartment','2003-02-10','ashwinrmcf@gmail.com','dfsadad','32341441434',NULL,'Ashwin Soni','MALE','https://f006.backblazeb2.com/file/NeedStation/AshwinSoni_8/ec4a4028-6f4a-4746-99b5-944eca51716c_1760125479305.PNG',NULL,'{\"english\":true,\"hindi\":false,\"tamil\":false,\"telugu\":false,\"kannada\":false,\"malayalam\":false,\"bengali\":false,\"marathi\":false}',_binary '',0,'2025-10-10 19:43:16.449965','2025-10-10 19:53:16.449965',NULL,'UPI','Flat No.:- 603, 6th Floor, Premium Tower- 7,Shalimar Township.','8357028350','123456',_binary '','452010','PENDING','https://res.cloudinary.com/dchmvabfy/image/upload/v1760125395/needstation/worker_profiles/worker_profiles/worker_8_1760125394501.jpg','2025-10-11','ACTIVE','https://f006.backblazeb2.com/file/NeedStation/AshwinSoni_8/7395d8e2-cf2a-4536-a676-7ca83dbd6eae_1760125484198.PNG',NULL,NULL,'afsdq12313',NULL,NULL,NULL,NULL,1,'08357028350','AVAILABLE','[]','','',0,'PENDING','1231313131',0.00,10,'{\"elderlyCare\": true, \"nursingCare\": true, \"paralysisCare\": false, \"pathologyCare\": false, \"physiotherapy\": false, \"motherBabyCare\": false, \"parkinsonsCare\": false, \"caretakerAtHome\": true, \"postSurgeryCare\": false, \"homeSecurityGuard\": false, \"diabetesManagement\": false, \"bedriddenPatientCare\": false, \"healthCheckUpServices\": false}',0,'CARETAKER','2025-10-10 19:43:02.981382','2025-10-10 19:45:48.336334','2003-02-10',_binary '',_binary '\0',NULL,NULL,NULL);
/*!40000 ALTER TABLE `worker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'needstation'
--

--
-- Dumping routines for database 'needstation'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-01 19:30:28
