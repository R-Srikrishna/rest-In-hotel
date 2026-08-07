-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: hotel_db
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'admin',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `password` (`password`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`),
  UNIQUE KEY `email_38` (`email`),
  UNIQUE KEY `email_39` (`email`),
  UNIQUE KEY `email_40` (`email`),
  UNIQUE KEY `email_41` (`email`),
  UNIQUE KEY `email_42` (`email`),
  UNIQUE KEY `email_43` (`email`),
  UNIQUE KEY `email_44` (`email`),
  UNIQUE KEY `email_45` (`email`),
  UNIQUE KEY `email_46` (`email`),
  UNIQUE KEY `email_47` (`email`),
  UNIQUE KEY `email_48` (`email`),
  UNIQUE KEY `email_49` (`email`),
  UNIQUE KEY `email_50` (`email`),
  UNIQUE KEY `email_51` (`email`),
  UNIQUE KEY `email_52` (`email`),
  UNIQUE KEY `email_53` (`email`),
  UNIQUE KEY `email_54` (`email`),
  UNIQUE KEY `email_55` (`email`),
  UNIQUE KEY `email_56` (`email`),
  UNIQUE KEY `email_57` (`email`),
  UNIQUE KEY `email_58` (`email`),
  UNIQUE KEY `email_59` (`email`),
  UNIQUE KEY `email_60` (`email`),
  UNIQUE KEY `email_61` (`email`),
  UNIQUE KEY `email_62` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (2,'superadmin@hotel.com','$2b$12$5apmdaPxQLHNo.M.FgV2e.9m0cLOiJwN0UG0guNUTjN3Da2eCjuoa','super-admin','2026-07-24 20:20:09','2026-07-24 20:20:09','Super','Admin',NULL),(4,'admin@gmail.com','$2b$12$BYfE3xd6Hy5gOXWwKKry4Otw7TVrP7ZClNuSxxtnjH4cOU37L9uLy','admin','2026-08-03 11:58:52','2026-08-03 11:58:52',NULL,NULL,NULL);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `checkInDate` datetime NOT NULL,
  `checkOutDate` datetime NOT NULL,
  `roomId` int NOT NULL,
  `guestId` int NOT NULL,
  `nightlyRate` float NOT NULL,
  `totalPrice` float NOT NULL,
  `selectedFeatures` json DEFAULT NULL,
  `status` enum('pending','booked','checked-in','checked-out','cancelled') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paymentStatus` enum('pending','partial','paid','failed') NOT NULL DEFAULT 'pending',
  `amountPaid` float NOT NULL DEFAULT '0',
  `amountDue` float NOT NULL DEFAULT '0',
  `guestName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `roomId` (`roomId`),
  KEY `guestId` (`guestId`),
  CONSTRAINT `bookings_guestId_foreign_idx` FOREIGN KEY (`guestId`) REFERENCES `guests` (`id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_101` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_103` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_105` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_107` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_109` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_11` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_111` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_113` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_115` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_117` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_119` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_121` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_122` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_123` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_124` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_125` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_126` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_127` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_128` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_129` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_13` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_130` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_131` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_132` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_133` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_134` FOREIGN KEY (`guestId`) REFERENCES `guests` (`id`),
  CONSTRAINT `bookings_ibfk_135` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_136` FOREIGN KEY (`guestId`) REFERENCES `guests` (`id`),
  CONSTRAINT `bookings_ibfk_137` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_138` FOREIGN KEY (`guestId`) REFERENCES `guests` (`id`),
  CONSTRAINT `bookings_ibfk_139` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_140` FOREIGN KEY (`guestId`) REFERENCES `guests` (`id`),
  CONSTRAINT `bookings_ibfk_15` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_17` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_19` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_21` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_23` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_25` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_27` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_29` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_31` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_33` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_35` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_37` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_39` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_41` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_43` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_45` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_47` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_49` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_5` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_51` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_53` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_55` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_57` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_59` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_61` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_63` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_65` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_67` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_69` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_7` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_71` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_73` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_75` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_77` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_79` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_81` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_83` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_85` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_87` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_89` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_9` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_91` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_93` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_95` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_97` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `bookings_ibfk_99` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (47,'2026-08-07 00:00:00','2026-08-10 00:00:00',8,6,1233,3699,NULL,'booked','2026-08-07 04:13:33','2026-08-07 04:13:33','pending',0,0,NULL);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guests`
--

DROP TABLE IF EXISTS `guests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `Gender` enum('male','female','other','prefer_not_to_say') DEFAULT 'prefer_not_to_say',
  `country` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT '0',
  `verificationToken` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guests`
--

LOCK TABLES `guests` WRITE;
/*!40000 ALTER TABLE `guests` DISABLE KEYS */;
INSERT INTO `guests` VALUES (3,'Sri','Krishna','srikrishnar007@gmail.com','$2b$10$ecGWrhj14B/P28wnzoxy6usiqogDZdLfwDMGaxIyCn64uIUejQ4eu',NULL,'prefer_not_to_say',NULL,NULL,1,NULL,'2026-06-21 04:53:08','2026-06-21 04:53:48'),(5,'Test','Guest','guest@example.com','$2b$10$LD2P9wFWGcauRa2ziXdO9eMtP2K3TnHpFgEvCz0sRtQPzmOlSnOLS','1234567890','prefer_not_to_say',NULL,NULL,0,NULL,'2026-08-03 06:56:57','2026-08-03 06:56:57'),(6,'sri','krishna','srikrishnarayud@gmail.com','$2b$10$t7nL8u7vIX65Impael7mOu8ME5YLLzUzLSivjZ.l9PbCKa2sygzzS','9876543210','prefer_not_to_say',NULL,NULL,0,NULL,'2026-08-03 10:56:27','2026-08-03 10:56:27');
/*!40000 ALTER TABLE `guests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bookingId` int NOT NULL,
  `stripePaymentIntentId` varchar(255) NOT NULL,
  `amount` int NOT NULL,
  `status` enum('pending','succeeded','failed','refunded') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stripePaymentIntentId` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_2` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_3` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_4` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_5` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_6` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_7` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_8` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_9` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_10` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_11` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_12` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_13` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_14` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_15` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_16` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_17` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_18` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_19` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_20` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_21` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_22` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_23` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_24` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_25` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_26` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_27` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_28` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_29` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_30` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_31` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_32` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_33` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_34` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_35` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_36` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_37` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_38` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_39` (`stripePaymentIntentId`),
  UNIQUE KEY `stripePaymentIntentId_40` (`stripePaymentIntentId`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,16,'pi_3TmA9i3vGsrY4oQC0shHwSdM',112,'pending','2026-06-25 10:05:10','2026-06-25 10:05:10'),(2,17,'pi_3TmA9x3vGsrY4oQC1IjD0ycT',112,'pending','2026-06-25 10:05:25','2026-06-25 10:05:25'),(3,18,'pi_3TmB1Q3vGsrY4oQC1b32mKgK',1234,'pending','2026-06-25 11:00:39','2026-06-25 11:00:39'),(4,19,'pi_3TmB2B3vGsrY4oQC0y7IP0LG',3702,'pending','2026-06-25 11:01:27','2026-06-25 11:01:27'),(5,20,'pi_3TmB2E3vGsrY4oQC1Ur96QW2',3702,'pending','2026-06-25 11:01:30','2026-06-25 11:01:30'),(6,21,'pi_3TmC3Q3vGsrY4oQC0u2OiAqA',224,'pending','2026-06-25 12:06:47','2026-06-25 12:06:47'),(7,22,'pi_3TmC3S3vGsrY4oQC1RrcziGI',224,'pending','2026-06-25 12:06:49','2026-06-25 12:06:49'),(8,23,'pi_3TmCdn3vGsrY4oQC1h8bdAUz',1234,'pending','2026-06-25 12:44:23','2026-06-25 12:44:23'),(9,24,'pi_3TmCfc3vGsrY4oQC1eKDPjQL',2468,'pending','2026-06-25 12:46:15','2026-06-25 12:46:15'),(10,25,'pi_3TmXbi3vGsrY4oQC1a9opbvQ',112,'pending','2026-06-26 11:07:38','2026-06-26 11:07:38'),(11,26,'pi_3TmXbj3vGsrY4oQC13cmS9dP',112,'pending','2026-06-26 11:07:38','2026-06-26 11:07:38'),(12,27,'pi_3TmZf43vGsrY4oQC0YhYvHiD',224,'pending','2026-06-26 13:19:13','2026-06-26 13:19:13'),(13,28,'pi_3TmZf63vGsrY4oQC1bx2eDUo',224,'pending','2026-06-26 13:19:15','2026-06-26 13:19:15'),(14,29,'pi_3TmZgD3vGsrY4oQC0rC5a0D6',224,'pending','2026-06-26 13:20:24','2026-06-26 13:20:24'),(15,30,'pi_3Tnvf43vGsrY4oQC1Reg5FLb',224,'pending','2026-06-30 07:00:49','2026-06-30 07:00:49'),(16,31,'pi_3TnvgI3vGsrY4oQC01SPNEK8',224,'pending','2026-06-30 07:02:05','2026-06-30 07:02:05'),(17,32,'pi_3TnwJy3vGsrY4oQC1wT0JIi3',224,'pending','2026-06-30 07:43:04','2026-06-30 07:43:04'),(18,33,'pi_3TnyTQ3vGsrY4oQC0voplfaM',112,'pending','2026-06-30 10:00:59','2026-06-30 10:00:59'),(19,34,'pi_3TnyTR3vGsrY4oQC0Iyn8LyM',112,'pending','2026-06-30 10:01:00','2026-06-30 10:01:00'),(20,35,'pi_3TnyUg3vGsrY4oQC1zpIy9vo',224,'pending','2026-06-30 10:02:18','2026-06-30 10:02:18'),(21,36,'pi_3Tnzxp3vGsrY4oQC1bkPdBTb',224,'pending','2026-06-30 11:36:28','2026-06-30 11:36:28'),(22,37,'pi_3To0oe3vGsrY4oQC02dnNhGo',224,'pending','2026-06-30 12:31:03','2026-06-30 12:31:03'),(23,38,'pi_3To0x63vGsrY4oQC19GuPQwT',224,'pending','2026-06-30 12:39:47','2026-06-30 12:39:47'),(24,39,'pi_3To0xu3vGsrY4oQC1SJ8ZTLW',224,'pending','2026-06-30 12:40:37','2026-06-30 12:40:37'),(25,40,'pi_3To0y23vGsrY4oQC0S7cazIK',224,'pending','2026-06-30 12:40:45','2026-06-30 12:40:45'),(26,41,'pi_3To1Or3vGsrY4oQC0DHhm8g1',224,'pending','2026-06-30 13:08:27','2026-06-30 13:08:27'),(27,42,'pi_3To1P33vGsrY4oQC1pUGdeU1',224,'pending','2026-06-30 13:08:40','2026-06-30 13:08:40'),(28,43,'pi_3TohKd3vGsrY4oQC07gQjaXQ',2468,'pending','2026-07-02 09:54:55','2026-07-02 09:54:55'),(29,44,'pi_3Tojme3vGsrY4oQC1gynvOzn',2468,'pending','2026-07-02 12:32:00','2026-07-02 12:32:00');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` decimal(10,2) NOT NULL,
  `tv` tinyint(1) NOT NULL DEFAULT '0',
  `fridge` tinyint(1) NOT NULL DEFAULT '0',
  `heater` tinyint(1) NOT NULL DEFAULT '0',
  `bathtub` tinyint(1) NOT NULL DEFAULT '0',
  `fan` tinyint(1) NOT NULL DEFAULT '0',
  `sofa` tinyint(1) NOT NULL DEFAULT '0',
  `chairs` tinyint(1) NOT NULL DEFAULT '0',
  `bed` tinyint(1) NOT NULL DEFAULT '1',
  `available` tinyint(1) NOT NULL DEFAULT '1',
  `room_number` int NOT NULL,
  `room_type` varchar(255) NOT NULL,
  `washing_machine` tinyint(1) NOT NULL DEFAULT '0',
  `internet_access` tinyint(1) NOT NULL DEFAULT '0',
  `coffee_tea` tinyint(1) NOT NULL DEFAULT '0',
  `private_pool` tinyint(1) NOT NULL DEFAULT '0',
  `air_conditioning` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,122.98,0,0,0,0,0,0,0,1,0,0,'',0,0,0,0,0),(4,111.99,1,0,0,0,1,0,0,1,1,0,'',0,0,0,0,0),(5,122.83,0,0,0,0,0,0,0,1,0,0,'',0,0,0,0,0),(6,1233.79,1,1,0,0,0,0,0,1,1,0,'',0,0,0,0,0),(7,2500.00,1,1,0,0,0,0,0,1,1,101,'Deluxe',0,0,0,0,1),(8,1233.00,0,0,0,0,0,0,0,1,1,102,'single',0,0,0,0,0);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-07 15:40:17
