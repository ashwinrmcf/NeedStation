-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: needstation
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `basic_needs_helper`
--

DROP TABLE IF EXISTS `basic_needs_helper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `basic_needs_helper` (
  `id` int DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `family_phone_number` varchar(50) DEFAULT NULL,
  `permanent_address` varchar(50) DEFAULT NULL,
  `current_address` varchar(50) DEFAULT NULL,
  `aadhaar_number` varchar(50) DEFAULT NULL,
  `police_verification_statue` varchar(50) DEFAULT NULL,
  `work_category` varchar(12) DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `emergency_contact_name` varchar(50) DEFAULT NULL,
  `emergency_contact_number` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `basic_needs_helper`
--

LOCK TABLES `basic_needs_helper` WRITE;
/*!40000 ALTER TABLE `basic_needs_helper` DISABLE KEYS */;
INSERT INTO `basic_needs_helper` VALUES (1,'Colleen','Steffens','csteffens0@newyorker.com','Female','997-471-3365','410-101-8722','9731 Rusk Terrace','1615 Vernon Court','522770410347','1','Electrician',8,'Colleen Steffens','575-207-1772'),(2,'Trixie','Erridge','terridge1@moonfruit.com','Female','248-856-1971','526-216-9379','5721 Judy Crossing','21 Namekagon Street','593147019793','1','Electrician',7,'Trixie Erridge','483-941-0921'),(3,'Hildagard','Alston','halston2@pbs.org','Female','499-351-5943','528-218-7081','5 Arizona Circle','6905 Fair Oaks Road','433338682271','0','Electrician',3,'Hildagard Alston','377-973-4655'),(4,'Guthry','Domenicone','gdomenicone3@vimeo.com','Male','585-130-4878','455-364-3636','30 Holy Cross Lane','164 Lighthouse Bay Pass','930549568810','0','Water Supply',7,'Guthry Domenicone','457-117-2517'),(5,'Kerby','Briers','kbriers4@163.com','Male','748-324-8414','479-979-8233','2584 Sundown Hill','60087 Golden Leaf Terrace','458690578421','1','Electrician',8,'Kerby Briers','660-602-6458'),(6,'Ibbie','Buxam','ibuxam5@si.edu','Female','189-517-8958','497-525-9182','4200 Evergreen Circle','53 East Way','471274010213','0','Water Supply',8,'Ibbie Buxam','203-916-8478'),(7,'May','Slocom','mslocom6@ted.com','Female','713-103-1516','749-472-6700','79 South Parkway','029 Kenwood Court','981765479811','1','Plumber',6,'May Slocom','408-556-9331'),(8,'Lanette','Annesley','lannesley7@buzzfeed.com','Female','463-480-4172','158-716-1962','2 Del Mar Center','0 Autumn Leaf Junction','923444604801','1','Electrician',5,'Lanette Annesley','415-752-1987'),(9,'Fleurette','Katz','fkatz8@eventbrite.com','Female','101-720-5849','971-799-9582','92 Lighthouse Bay Terrace','833 Graceland Avenue','997099531335','0','Plumber',9,'Fleurette Katz','496-622-4631'),(10,'Rayshell','Shucksmith','rshucksmith9@pbs.org','Female','981-827-9982','189-910-4269','63 Prairie Rose Circle','28109 Golf View Avenue','914906195880','1','Electrician',13,'Rayshell Shucksmith','739-507-9868'),(11,'Ianthe','Godlonton','igodlontona@dagondesign.com','Bigender','263-484-2299','414-660-0569','25 Milwaukee Parkway','50979 Arrowood Hill','834843445220','1','Electrician',9,'Ianthe Godlonton','979-179-0724'),(12,'Parsifal','Boraston','pborastonb@paypal.com','Male','566-572-1005','791-575-7534','34939 Karstens Road','20 Grayhawk Pass','826315706220','1','Water Supply',10,'Parsifal Boraston','175-258-2425'),(13,'Berthe','Kleinstub','bkleinstubc@aboutads.info','Female','780-191-6254','391-587-6514','2177 Vernon Court','57774 Sachs Avenue','408774362300','0','Water Supply',11,'Berthe Kleinstub','689-241-0227'),(14,'Kinny','Gyorgy','kgyorgyd@qq.com','Male','943-687-3810','679-894-3531','35090 Bayside Plaza','39 Ronald Regan Parkway','995377801226','1','Electrician',4,'Kinny Gyorgy','234-736-2206'),(15,'Billy','Newlyn','bnewlyne@sohu.com','Female','364-126-4259','498-943-5803','68853 Hermina Point','079 Lakewood Gardens Park','451603658631','0','Water Supply',7,'Billy Newlyn','552-846-5608'),(16,'Halie','Tinston','htinstonf@about.me','Female','250-751-4114','348-879-8318','0 Mockingbird Plaza','57 Sunnyside Junction','442074841013','1','Electrician',14,'Halie Tinston','563-287-0374'),(17,'Emmi','Castagnone','ecastagnoneg@w3.org','Female','550-443-5805','591-988-0280','540 Onsgard Way','86537 Boyd Parkway','859864431715','0','Plumber',9,'Emmi Castagnone','482-415-4844'),(18,'Joellyn','Greville','jgrevilleh@vistaprint.com','Female','471-116-1853','719-240-2166','42498 Sullivan Park','51 Green Ridge Road','550375419951','1','Plumber',11,'Joellyn Greville','475-759-5407'),(19,'Cesar','Sinclar','csinclari@digg.com','Male','841-109-9962','595-106-4432','16776 Warrior Alley','9610 Westend Court','722356470034','1','Electrician',4,'Cesar Sinclar','565-137-5891'),(20,'Samaria','Millott','smillottj@google.es','Female','783-929-8031','760-999-0189','45 Packers Circle','222 Lunder Plaza','942171186968','1','Electrician',14,'Samaria Millott','854-526-8131'),(21,'Graig','Treadaway','gtreadawayk@nbcnews.com','Male','150-234-6378','452-750-1172','25 Tennyson Crossing','4399 East Junction','409099473138','1','Water Supply',7,'Graig Treadaway','870-336-3766'),(22,'Syman','Arons','saronsl@csmonitor.com','Male','110-599-7259','288-993-1514','20 Service Terrace','756 Rutledge Avenue','442353256573','1','Electrician',7,'Syman Arons','274-415-5140'),(23,'Lenora','Skill','lskillm@fema.gov','Female','587-436-9733','612-173-0452','1290 Waywood Place','30 Hoffman Alley','718981752724','0','Electrician',11,'Lenora Skill','216-785-3626'),(24,'Nathanial','Utteridge','nutteridgen@list-manage.com','Male','488-733-7002','173-508-8887','0817 Dennis Park','573 Luster Junction','486726565111','1','Electrician',5,'Nathanial Utteridge','526-811-4362'),(25,'Ashlee','McKinie','amckinieo@angelfire.com','Female','483-316-2793','509-285-7920','94 Waywood Point','24084 Bartelt Court','739033601839','1','Plumber',4,'Ashlee McKinie','472-356-5544'),(26,'Kristen','Bartrap','kbartrapp@microsoft.com','Female','241-131-8188','390-908-0097','43 Arrowood Crossing','90 Barby Lane','965969789144','1','Water Supply',3,'Kristen Bartrap','768-301-4385'),(27,'Allistir','Elderkin','aelderkinq@desdev.cn','Male','391-669-0729','946-622-6092','52562 Hauk Junction','4210 Meadow Vale Drive','310150020710','0','Water Supply',4,'Allistir Elderkin','552-376-3366'),(28,'Hunter','Matuszyk','hmatuszykr@flickr.com','Male','654-576-5123','236-463-6149','537 Oak Junction','02 Meadow Vale Alley','303491097506','1','Water Supply',12,'Hunter Matuszyk','363-629-9801'),(29,'Urbanus','Eringey','ueringeys@dmoz.org','Bigender','273-366-0260','581-178-8613','26752 Debs Center','87023 Lunder Pass','376966722968','1','Water Supply',7,'Urbanus Eringey','852-448-8734'),(30,'Markos','Kersting','mkerstingt@mashable.com','Male','910-523-2139','249-973-4368','4885 5th Center','567 Sundown Circle','948070699073','1','Water Supply',5,'Markos Kersting','887-666-6174'),(31,'Renard','Priel','rprielu@joomla.org','Male','372-222-2971','655-715-3967','8924 Calypso Court','11 Clarendon Park','622293656503','0','Plumber',14,'Renard Priel','861-942-0632'),(32,'Zacharie','Palfreeman','zpalfreemanv@sbwire.com','Male','637-366-8444','559-248-1372','49 Prentice Drive','5406 Fordem Lane','549964723641','1','Water Supply',3,'Zacharie Palfreeman','778-561-0396'),(33,'Guthry','Magenny','gmagennyw@craigslist.org','Male','913-257-0270','339-449-2024','03 Prairieview Hill','49 Lawn Lane','672775483552','1','Plumber',14,'Guthry Magenny','181-364-9057'),(34,'Nerte','Conahy','nconahyx@boston.com','Female','330-653-3486','755-200-4190','5 Crownhardt Circle','58903 Maple Wood Center','891380458678','0','Water Supply',13,'Nerte Conahy','559-968-2685'),(35,'Gradeigh','Caw','gcawy@nsw.gov.au','Male','125-707-5759','163-412-3759','8 Kensington Street','8085 Division Park','892890000485','0','Electrician',8,'Gradeigh Caw','322-197-7867'),(36,'Winny','Huortic','whuorticz@meetup.com','Male','806-985-5406','986-618-7828','4598 Ridge Oak Junction','2 Victoria Point','908731437909','0','Plumber',14,'Winny Huortic','255-116-0076'),(37,'Reginald','Haskey','rhaskey10@vinaora.com','Agender','104-917-0986','690-164-0429','684 Hansons Park','3 Marcy Drive','669670084688','1','Electrician',2,'Reginald Haskey','300-415-8118'),(38,'Carilyn','Coggles','ccoggles11@csmonitor.com','Non-binary','986-943-8212','813-595-6867','3 Pine View Lane','3 Sachtjen Street','933936004998','0','Electrician',2,'Carilyn Coggles','196-419-8445'),(39,'Susie','Fullom','sfullom12@hugedomains.com','Female','579-863-7542','391-971-0258','6286 Prentice Junction','04 Ilene Road','878449256284','1','Plumber',4,'Susie Fullom','489-774-6413'),(40,'Kathryn','Darrow','kdarrow13@sourceforge.net','Female','968-490-3658','944-308-0004','7 New Castle Lane','78336 5th Park','841983958500','1','Plumber',7,'Kathryn Darrow','488-824-0637'),(41,'Camala','Waplington','cwaplington14@pcworld.com','Female','739-777-1986','194-250-3979','26 Mosinee Way','40 Hanover Street','719254208726','0','Water Supply',3,'Camala Waplington','434-118-8153'),(42,'Tommie','Duerden','tduerden15@goo.ne.jp','Female','694-414-1797','997-959-7905','380 Golf Course Trail','8876 Del Mar Terrace','467409359042','0','Electrician',6,'Tommie Duerden','460-568-7369'),(43,'Mikey','Sackett','msackett16@marketwatch.com','Male','932-825-1629','562-707-7992','355 Dawn Trail','89 Debra Place','825725388138','1','Plumber',15,'Mikey Sackett','938-369-4677'),(44,'Colan','Rutledge','crutledge17@dyndns.org','Male','920-964-6298','731-961-6706','9188 Gerald Center','3 Maywood Avenue','560038960475','1','Electrician',4,'Colan Rutledge','551-755-6007'),(45,'Joella','Bourgour','jbourgour18@woothemes.com','Female','595-828-4286','708-293-0559','8230 3rd Circle','848 Burrows Court','397257059967','1','Plumber',2,'Joella Bourgour','252-303-3640'),(46,'Esma','Ionnidis','eionnidis19@studiopress.com','Female','395-738-6582','747-263-2731','363 Loomis Trail','494 Dayton Court','407250231358','1','Water Supply',10,'Esma Ionnidis','625-461-8102'),(47,'Moshe','Waterland','mwaterland1a@ihg.com','Genderqueer','392-790-6382','427-218-1636','66 Burrows Plaza','1543 Saint Paul Street','363773341431','0','Water Supply',15,'Moshe Waterland','419-242-9062'),(48,'Mohandis','Head','mhead1b@rediff.com','Polygender','399-854-4101','798-848-1456','02 Beilfuss Way','2 Union Point','813942723848','0','Electrician',14,'Mohandis Head','554-526-6036'),(49,'Rubia','Skoate','rskoate1c@surveymonkey.com','Female','736-755-7551','933-842-0389','67 Dapin Lane','03 American Ash Terrace','352134175780','0','Water Supply',8,'Rubia Skoate','748-268-2016'),(50,'Clyve','Domsalla','cdomsalla1d@amazon.de','Male','201-639-9155','878-110-4697','01 Ludington Pass','75 Dayton Court','693403481258','1','Water Supply',5,'Clyve Domsalla','948-567-1445');
/*!40000 ALTER TABLE `basic_needs_helper` ENABLE KEYS */;
UNLOCK TABLES;

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
  `transaction_id` varchar(100) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `user_name` varchar(200) DEFAULT NULL,
  `formality_data_json` json DEFAULT NULL COMMENT 'Service-specific form data from Step 2',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKe2b8ksk9hptq6l8msdvoo6anv` (`booking_number`),
  UNIQUE KEY `UKe0p6k9xpku6j2m89duwxuqw11` (`booking_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (6,NULL,8,NULL,NULL,'Indore',NULL,'2025-10-26 13:32:12.571077',NULL,NULL,NULL,NULL,NULL,'Flat no 603, Shalimar Township',NULL,NULL,NULL,NULL,'PENDING','452010','2025-10-28',NULL,NULL,NULL,'2025-10-26 14:36:10.221743',NULL,NULL,'Companion Care',NULL,'Madhya Pradesh','CONFIRMED','2025-10-26 14:36:10.307449','URGENT',NULL,NULL,0.00,NULL,'Ashwin Soni',1000.00,'BK-20251026-00003',NULL,NULL,12,NULL,NULL,NULL,0.00,'{\"patient_age\":\"21\",\"patient_gender\":\"male\",\"health_status\":\"fair\",\"interests_hobbies\":\"we\",\"companionship_hours\":\"8\",\"communication_ability\":\"limited_verbal\",\"special_requirements\":\"weq\"}','Indore City, Indore, Juni Indore Tahsil, इन्दौर ज़िला, Madhya Pradesh, 452001, India',22.73563706,75.85623451,'8357028350','afternoon','COMPANION_CARE',24,NULL,0,NULL,1000.00,NULL,NULL,'ashwinrmcf@gmail.com',12,'Ashwin Soni','{\"patient_age\": \"21\", \"health_status\": \"fair\", \"patient_gender\": \"male\", \"interests_hobbies\": \"we\", \"companionship_hours\": \"8\", \"special_requirements\": \"weq\", \"communication_ability\": \"limited_verbal\"}');
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
INSERT INTO `services` VALUES (23,1200.00,'Elder Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/elder_care/ec2_personal.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Comprehensive personal care services for elderly',_binary '','PERSONAL_CARE','Personal Care','2025-10-26 17:05:49.000000',NULL),(24,1000.00,'Elder Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/elder_care/ec1_companion.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Companionship and emotional support for seniors',_binary '','COMPANION_CARE','Companion Care','2025-10-26 17:05:49.000000',NULL),(25,1500.00,'Elder Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/elder_care/ec4_respite.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Temporary relief care for family caregivers',_binary '','RESPITE_CARE','Respite Care','2025-10-26 17:05:49.000000',NULL),(26,2000.00,'Elder Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/elder_care/ec3_dementia.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Specialized care for dementia and Alzheimer patients',_binary '','DEMENTIA_CARE','Dementia Care','2025-10-26 17:05:49.000000',NULL),(27,2500.00,'Bedridden Patient Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/bedridden_patient_care/bpc1_complete_bed_care.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Full care for bedridden patients',_binary '','COMPLETE_BED_CARE','Complete Bed Care','2025-10-26 17:05:49.000000',NULL),(28,2800.00,'Bedridden Patient Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/bedridden_patient_care/bpc2_stroke_patient.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Specialized care for stroke patients',_binary '','STROKE_PATIENT_CARE','Stroke Patient Care','2025-10-26 17:05:49.000000',NULL),(29,3500.00,'Bedridden Patient Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/bedridden_patient_care/bpc3_coma.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Intensive care for coma patients',_binary '','COMA_CARE','Coma Care','2025-10-26 17:05:49.000000',NULL),(30,3000.00,'Bedridden Patient Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/bedridden_patient_care/bpc4_palliativecare.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Comfort care for terminally ill patients',_binary '','PALLIATIVE_CARE','Palliative Care','2025-10-26 17:05:49.000000',NULL),(31,15000.00,'Caretaker at Home',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/caretaker_at_home/cah1_live_in_caretaker.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'24/7 live-in caretaker services',_binary '','LIVE_IN_CARETAKER','Live-in Caretaker','2025-10-26 17:05:49.000000',NULL),(32,8000.00,'Caretaker at Home',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/caretaker_at_home/cah2_part_time_caretaker.webp','2025-10-26 17:05:49.000000',NULL,NULL,'Part-time caretaker for daily tasks',_binary '','PART_TIME_CARETAKER','Part-time Caretaker','2025-10-26 17:05:49.000000',NULL),(33,10000.00,'Caretaker at Home',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/caretaker_at_home/cah3_cook.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Professional cooking services at home',_binary '','COOK','Cook','2025-10-26 17:05:49.000000',NULL),(34,12000.00,'Caretaker at Home',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/caretaker_at_home/cah4_nanny.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Professional nanny for child care',_binary '','NANNY','Nanny','2025-10-26 17:05:49.000000',NULL),(35,1800.00,'Diabetes Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/diabetes_care/dm_type_1.webp','2025-10-26 17:05:49.000000',NULL,NULL,'Care and management for Type 1 diabetes',_binary '','TYPE1_DIABETES','Type 1 Diabetes','2025-10-26 17:05:49.000000',NULL),(36,1500.00,'Diabetes Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/diabetes_care/db2_type2.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Care and management for Type 2 diabetes',_binary '','TYPE2_DIABETES','Type 2 Diabetes','2025-10-26 17:05:49.000000',NULL),(37,2000.00,'Diabetes Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/diabetes_care/dm3_gestational.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Diabetes care during pregnancy',_binary '','GESTATIONAL_DIABETES','Gestational Diabetes','2025-10-26 17:05:49.000000',NULL),(38,2500.00,'Diabetes Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/diabetes_care/dm4_complication.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Management of diabetes complications',_binary '','DIABETES_COMPLICATION','Diabetes Complication','2025-10-26 17:05:49.000000',NULL),(39,1500.00,'Health Checkup',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/health_check_up_services/hcs1_basic.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Basic health screening package',_binary '','BASIC_HEALTH_CHECKUP','Basic Health Checkup','2025-10-26 17:05:49.000000',NULL),(40,3500.00,'Health Checkup',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/health_check_up_services/hcs2_comprehensive_health_checkup.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Complete health checkup package',_binary '','COMPREHENSIVE_HEALTH_CHECKUP','Comprehensive Health Checkup','2025-10-26 17:05:49.000000',NULL),(41,2500.00,'Health Checkup',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/health_check_up_services/hcs3_senior_citizen.png','2025-10-26 17:05:49.000000',NULL,NULL,'Specialized health checkup for seniors',_binary '','SENIOR_CITIZEN_HEALTH_CHECKUP','Senior Citizen Health Checkup','2025-10-26 17:05:49.000000',NULL),(42,2800.00,'Health Checkup',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/health_check_up_services/hcs4_women_health_checkup.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Comprehensive women health screening',_binary '','WOMEN_HEALTH_CHECKUP','Women Health Checkup','2025-10-26 17:05:49.000000',NULL),(43,2000.00,'Mother and Baby Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/mother_and_baby_care/mbc_newborn_care.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Professional newborn care services',_binary '','NEWBORN_CARE','Newborn Care','2025-10-26 17:05:49.000000',NULL),(44,2500.00,'Mother and Baby Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/mother_and_baby_care/mbc_postnatal.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Postnatal care for mother and baby',_binary '','POSTNATAL_CARE','Postnatal Care','2025-10-26 17:05:49.000000',NULL),(45,1200.00,'Mother and Baby Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/mother_and_baby_care/mbc_baby_massage_and_care.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Baby massage and wellness care',_binary '','BABY_MASSAGE_CARE','Baby Massage and Care','2025-10-26 17:05:49.000000',NULL),(46,3500.00,'Mother and Baby Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/mother_and_baby_care/mbc_twins_baby_care.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Specialized care for twins',_binary '','TWINS_BABY_CARE','Twins Baby Care','2025-10-26 17:05:49.000000',NULL),(47,2000.00,'Nursing Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/nursing_care/nc1_general_nursing.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'General nursing care at home',_binary '','GENERAL_NURSING','General Nursing','2025-10-26 17:05:49.000000',NULL),(48,3500.00,'Nursing Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/nursing_care/nc2_icu_trained.jpeg','2025-10-26 17:05:49.000000',NULL,NULL,'ICU trained nursing care',_binary '','ICU_TRAINED_NURSE','ICU Trained Nurse','2025-10-26 17:05:49.000000',NULL),(49,1800.00,'Nursing Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/nursing_care/nc3_wound_care.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Professional wound care and dressing',_binary '','WOUND_CARE','Wound Care','2025-10-26 17:05:49.000000',NULL),(50,2500.00,'Nursing Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/nursing_care/nc4_pediatric.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Specialized pediatric nursing care',_binary '','PEDIATRIC_NURSING','Pediatric Nursing','2025-10-26 17:05:49.000000',NULL),(51,2500.00,'Paralysis Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/paralysis_care/parac1_hemiplegia_care.webp','2025-10-26 17:05:49.000000',NULL,NULL,'Care for one-sided paralysis',_binary '','HEMIPLEGIA_CARE','Hemiplegia Care','2025-10-26 17:05:49.000000',NULL),(52,3000.00,'Paralysis Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/paralysis_care/parac2_paraphlegia.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Care for lower body paralysis',_binary '','PARAPHLEGIA_CARE','Paraphlegia Care','2025-10-26 17:05:49.000000',NULL),(53,4000.00,'Paralysis Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/paralysis_care/parac3_quadriplegia.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Care for full body paralysis',_binary '','QUADRIPLEGIA_CARE','Quadriplegia Care','2025-10-26 17:05:49.000000',NULL),(54,2000.00,'Paralysis Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/paralysis_care/parac4_facial_paralysis.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Care for facial paralysis',_binary '','FACIAL_PARALYSIS_CARE','Facial Paralysis Care','2025-10-26 17:05:49.000000',NULL),(55,2200.00,'Parkinsons Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/parkinsons_cae/pc1_early_stage.jfif','2025-10-26 17:05:49.000000',NULL,NULL,'Care for early stage Parkinsons',_binary '','EARLY_STAGE_PARKINSONS','Early Stage Parkinsons','2025-10-26 17:05:49.000000',NULL),(56,3500.00,'Parkinsons Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/parkinsons_cae/pc2_advanced_stage.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Care for advanced Parkinsons',_binary '','ADVANCED_STAGE_PARKINSONS','Advanced Stage Parkinsons','2025-10-26 17:05:49.000000',NULL),(57,2800.00,'Parkinsons Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/parkinsons_cae/pc3_therapy_support.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Therapy and support for Parkinsons',_binary '','PARKINSONS_THERAPY_SUPPORT','Parkinsons Therapy Support','2025-10-26 17:05:49.000000',NULL),(58,500.00,'Pathology Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/pathology_care/pathc1_home_sample.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Blood and sample collection at home',_binary '','HOME_SAMPLE_COLLECTION','Home Sample Collection','2025-10-26 17:05:49.000000',NULL),(59,1500.00,'Pathology Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/pathology_care/pathc2_diagnostic_services.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Complete diagnostic services',_binary '','DIAGNOSTIC_SERVICES','Diagnostic Services','2025-10-26 17:05:49.000000',NULL),(60,2000.00,'Pathology Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/pathology_care/pathc3_regular_monitoring.webp','2025-10-26 17:05:49.000000',NULL,NULL,'Regular health monitoring services',_binary '','REGULAR_MONITORING','Regular Monitoring','2025-10-26 17:05:49.000000',NULL),(61,3000.00,'Pathology Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/pathology_care/pathc4_corporate_health.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Corporate health screening package',_binary '','CORPORATE_HEALTH_PACKAGE','Corporate Health Package','2025-10-26 17:05:49.000000',NULL),(62,1500.00,'Physiotherapy',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/physiotherapy/p1_orthopedic.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Physiotherapy for bone and joint issues',_binary '','ORTHOPEDIC_PHYSIOTHERAPY','Orthopedic Physiotherapy','2025-10-26 17:05:49.000000',NULL),(63,2000.00,'Physiotherapy',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/physiotherapy/p2_neurological.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Physiotherapy for neurological conditions',_binary '','NEUROLOGICAL_PHYSIOTHERAPY','Neurological Physiotherapy','2025-10-26 17:05:49.000000',NULL),(64,1800.00,'Physiotherapy',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/physiotherapy/p3_pediatric.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Physiotherapy for children',_binary '','PEDIATRIC_PHYSIOTHERAPY','Pediatric Physiotherapy','2025-10-26 17:05:49.000000',NULL),(65,1600.00,'Physiotherapy',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/physiotherapy/p4_geriatric.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Physiotherapy for elderly patients',_binary '','GERIATRIC_PHYSIOTHERAPY','Geriatric Physiotherapy','2025-10-26 17:05:49.000000',NULL),(66,3500.00,'Post Surgery Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/post_surgery_care/ps1_cardiac_surgery.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Post-operative care for cardiac surgery',_binary '','CARDIAC_SURGERY_CARE','Cardiac Surgery Care','2025-10-26 17:05:49.000000',NULL),(67,2500.00,'Post Surgery Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/post_surgery_care/ps2_orthopedic.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Post-operative care for orthopedic surgery',_binary '','ORTHOPEDIC_SURGERY_CARE','Orthopedic Surgery Care','2025-10-26 17:05:49.000000',NULL),(68,2800.00,'Post Surgery Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/post_surgery_care/ps3_abdominal_surgery_care.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Post-operative care for abdominal surgery',_binary '','ABDOMINAL_SURGERY_CARE','Abdominal Surgery Care','2025-10-26 17:05:49.000000',NULL),(69,4000.00,'Post Surgery Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/post_surgery_care/ps4_neuro_surgery_care.webp','2025-10-26 17:05:49.000000',NULL,NULL,'Post-operative care for neuro surgery',_binary '','NEURO_SURGERY_CARE','Neuro Surgery Care','2025-10-26 17:05:49.000000',NULL),(70,12000.00,'Security Guard',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/security_guard/hsg_home_sec.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Residential security guard services',_binary '','HOME_SECURITY','Home Security','2025-10-26 17:05:49.000000',NULL),(71,15000.00,'Security Guard',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/security_guard/hsg_corporate_security.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Corporate security services',_binary '','CORPORATE_SECURITY','Corporate Security','2025-10-26 17:05:49.000000',NULL),(72,8000.00,'Security Guard',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/security_guard/hsg_event_security.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Event security management',_binary '','EVENT_SECURITY','Event Security','2025-10-26 17:05:49.000000',NULL),(73,10000.00,'Security Guard',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/security_guard/hsg_night_watchman.jpg','2025-10-26 17:05:49.000000',NULL,NULL,'Night watchman services',_binary '','NIGHT_WATCHMAN','Night Watchman','2025-10-26 17:05:49.000000',NULL),(74,2500.00,'Parkinsons Care',NULL,'https://res.cloudinary.com/dchmvabfy/image/upload/v1/needstation/minicards/parkinsons_cae/pc4_family_support.jpg','2025-10-26 17:11:57.000000',NULL,NULL,'Family support and counseling for Parkinsons',_binary '','FAMILY_SUPPORT_CARE','Family Support Care','2025-10-26 17:11:57.000000',NULL);
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-28 22:56:13
