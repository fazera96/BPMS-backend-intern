-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 21, 2025 at 04:11 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bpms`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `account_id` int(10) NOT NULL,
  `account_username` varchar(100) NOT NULL,
  `account_password` varchar(100) NOT NULL,
  `account_role` int(2) NOT NULL COMMENT '1. Staff\r\n2. Storekeeper\r\n3. Accountant\r\n4. Admin',
  `account_lastLogin` varchar(30) DEFAULT NULL,
  `account_lastLogout` varchar(30) DEFAULT NULL,
  `account_email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `electricaldesign`
--

CREATE TABLE `electricaldesign` (
  `electricaldesign_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `activity_status` int(2) NOT NULL DEFAULT 1 COMMENT '1. Not Started\r\n2. In-Progress\r\n3. On Hold\r\n4. Completed',
  `overall_progress` int(2) DEFAULT NULL COMMENT '1.On-Time\r\n2. Delayed',
  `progress_percentage` int(3) NOT NULL DEFAULT 0,
  `estimated_duration` varchar(30) DEFAULT NULL,
  `planned_start_date` varchar(30) DEFAULT NULL,
  `actual_start_date` varchar(30) DEFAULT NULL,
  `date_of_completion` varchar(30) DEFAULT NULL,
  `remarks_schedule` varchar(30) DEFAULT NULL,
  `verified_by` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `factoryacceptance`
--

CREATE TABLE `factoryacceptance` (
  `factoryacceptance_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `activity_status` int(2) NOT NULL DEFAULT 1 COMMENT '1. Not Started\r\n2. In-Progress\r\n3. On Hold\r\n4. Completed',
  `overall_progress` int(2) DEFAULT NULL COMMENT '1. On-Time\r\n2. Delayed',
  `progress_percentage` int(3) NOT NULL DEFAULT 0,
  `estimated_duration` varchar(30) DEFAULT NULL,
  `planned_start_date` varchar(30) DEFAULT NULL,
  `actual_start_date` varchar(30) DEFAULT NULL,
  `date_of_completion` varchar(30) DEFAULT NULL,
  `remarks_schedule` varchar(30) DEFAULT NULL,
  `verified_by` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_specs`
--

CREATE TABLE `job_specs` (
  `job_no` varchar(30) NOT NULL,
  `job_desc` varchar(100) NOT NULL,
  `issue_date` varchar(30) NOT NULL,
  `issue_by` int(10) DEFAULT NULL,
  `client_name` varchar(30) DEFAULT NULL,
  `client_contact` varchar(30) DEFAULT NULL,
  `site_location` varchar(30) DEFAULT NULL,
  `delivery_date` varchar(30) DEFAULT NULL,
  `job_type` int(2) NOT NULL COMMENT '1. New Project\r\n2. In House\r\n3. R&D\r\n4.Corrective Maintanance\r\n5. Preventive Maintanance',
  `job_status` int(2) NOT NULL DEFAULT 1 COMMENT '1. Pending Approval\r\n2. Approved\r\n3. Rejected\r\n4. Deleted',
  `job_status_desc` varchar(250) DEFAULT NULL,
  `modified_date` varchar(30) DEFAULT NULL,
  `modified_by` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_specs_item`
--

CREATE TABLE `job_specs_item` (
  `item_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `item_desc` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_specs_others`
--

CREATE TABLE `job_specs_others` (
  `others_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `others_desc` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_specs_requirement`
--

CREATE TABLE `job_specs_requirement` (
  `requirement_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `requirement_desc` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `log_id` int(10) NOT NULL,
  `log_desc` varchar(100) NOT NULL,
  `log_datetime` varchar(30) NOT NULL,
  `log_user_id` int(10) NOT NULL,
  `job_no` varchar(30) DEFAULT NULL,
  `pr_no` int(10) DEFAULT NULL,
  `pr_item_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mechanicalassembly`
--

CREATE TABLE `mechanicalassembly` (
  `mechanicalassembly_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `activity_status` int(2) NOT NULL DEFAULT 1 COMMENT '1.Not Started\r\n2. In-Progress\r\n3. On Hold\r\n4. Completed',
  `overall_progress` int(2) DEFAULT NULL COMMENT '1. On-Time\r\n2. Delayed',
  `progress_percentage` int(3) NOT NULL DEFAULT 0,
  `estimated_duration` varchar(30) DEFAULT NULL,
  `planned_start_date` varchar(30) DEFAULT NULL,
  `actual_start_date` varchar(30) DEFAULT NULL,
  `date_of_completion` varchar(30) DEFAULT NULL,
  `remarks_schedule` varchar(30) DEFAULT NULL,
  `verified_by` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mechanicaldesign`
--

CREATE TABLE `mechanicaldesign` (
  `mechanicaldesign_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `activity_status` int(2) NOT NULL DEFAULT 1 COMMENT '1. Not Started\r\n2. In-Progress\r\n3. On Hold\r\n4. Completed',
  `overall_progress` int(2) DEFAULT NULL COMMENT '1. On-Time\r\n2. Delayed',
  `progress_percentage` int(3) NOT NULL DEFAULT 0,
  `estimated_duration` varchar(30) DEFAULT NULL,
  `planned_start_date` varchar(30) DEFAULT NULL,
  `actual_start_date` varchar(30) DEFAULT NULL,
  `date_of_completion` varchar(30) DEFAULT NULL,
  `remarks_schedule` varchar(30) DEFAULT NULL,
  `verified_by` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `packagingdelivery`
--

CREATE TABLE `packagingdelivery` (
  `packagingdelivery_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `activity_status` int(2) NOT NULL DEFAULT 1 COMMENT '1. Not Started\r\n2. In-Progress\r\n3. On Hold\r\n4. Completed',
  `overall_progress` int(2) DEFAULT NULL COMMENT '1. On-Time\r\n2. Delayed',
  `progress_percentage` int(3) NOT NULL DEFAULT 0,
  `estimated_duration` varchar(30) DEFAULT NULL,
  `planned_start_date` varchar(30) DEFAULT NULL,
  `actual_start_date` varchar(30) DEFAULT NULL,
  `date_of_completion` varchar(30) DEFAULT NULL,
  `remarks_schedule` varchar(30) DEFAULT NULL,
  `verified_by` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pc_final_report`
--

CREATE TABLE `pc_final_report` (
  `finalReport_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `finalReport_attachment` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pc_pdi_report`
--

CREATE TABLE `pc_pdi_report` (
  `pdiReport_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `pdiReport_attachment` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pc_progress_report`
--

CREATE TABLE `pc_progress_report` (
  `progressReport_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `production`
--

CREATE TABLE `production` (
  `production_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `activity_status` int(2) NOT NULL DEFAULT 1 COMMENT '1.Not Started\r\n2. In-Progress\r\n3.On Hold\r\n4.Completed',
  `overall_progress` int(2) DEFAULT NULL COMMENT '1. On-Time\r\n2. Delayed',
  `progress_percentage` int(3) NOT NULL DEFAULT 0,
  `estimated_duration` varchar(30) DEFAULT NULL,
  `planned_start_date` varchar(30) DEFAULT NULL,
  `actual_start_date` varchar(30) DEFAULT NULL,
  `date_of_completion` varchar(30) DEFAULT NULL,
  `remarks_schedule` varchar(30) DEFAULT NULL,
  `verified_by` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `programmingtesting`
--

CREATE TABLE `programmingtesting` (
  `programmingtesting_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `activity_status` int(2) NOT NULL DEFAULT 1 COMMENT '1. Not Started\r\n2. In-Progress\r\n3. On Hold\r\n4. Completed',
  `overall_progress` int(2) DEFAULT NULL COMMENT '1. On-Time\r\n2. Delayed',
  `progress_percentage` int(3) NOT NULL DEFAULT 0,
  `estimated_duration` varchar(30) DEFAULT NULL,
  `planned_start_date` varchar(30) DEFAULT NULL,
  `actual_start_date` varchar(30) DEFAULT NULL,
  `date_of_completion` varchar(30) DEFAULT NULL,
  `remarks_schedule` varchar(30) DEFAULT NULL,
  `verified_by` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_requisition`
--

CREATE TABLE `purchase_requisition` (
  `pr_no` int(10) NOT NULL,
  `pr_type` int(2) NOT NULL COMMENT '1.Store\r\n2. Goods\r\n3. Services',
  `job_no` varchar(30) NOT NULL,
  `pr_date` varchar(30) NOT NULL,
  `pr_attachment` varchar(500) DEFAULT NULL,
  `po_no` varchar(30) DEFAULT NULL,
  `po_date` varchar(30) DEFAULT NULL,
  `po_attachment` varchar(500) DEFAULT NULL,
  `po_update_by` int(10) DEFAULT NULL,
  `supplier_name` varchar(30) DEFAULT NULL,
  `requestor` int(10) DEFAULT NULL,
  `pr_status` int(2) NOT NULL COMMENT '1.Pending Approval\r\n2. Store Checking\r\n3. Approved\r\n4. Rejected\r\n5. Waiting Delivery\r\n6. Complete',
  `currency` varchar(5) DEFAULT NULL,
  `pr_status_desc` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_requisition_item`
--

CREATE TABLE `purchase_requisition_item` (
  `pr_item_id` int(10) NOT NULL,
  `pr_no` int(10) NOT NULL,
  `item_quantity` int(10) NOT NULL,
  `item_price` float NOT NULL DEFAULT 0,
  `item_desc` varchar(30) NOT NULL,
  `est_delivery_item` varchar(30) NOT NULL,
  `drawing_no` varchar(30) DEFAULT NULL,
  `qty_delivered_item` int(10) NOT NULL DEFAULT 0,
  `qty_taken_item` int(10) NOT NULL DEFAULT 0,
  `qty_reject_item` int(10) NOT NULL DEFAULT 0,
  `qty_replace_item` int(10) NOT NULL DEFAULT 0,
  `qty_ok_item` int(10) NOT NULL DEFAULT 0,
  `received_by` varchar(30) DEFAULT NULL,
  `delivered_date` varchar(30) DEFAULT NULL,
  `inspect_by` varchar(30) DEFAULT NULL,
  `inspect_date` varchar(30) DEFAULT NULL,
  `taken_by` varchar(30) DEFAULT NULL,
  `taken_date` varchar(30) DEFAULT NULL,
  `modified_by` varchar(30) DEFAULT NULL,
  `modified_date` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `remarks_desc`
--

CREATE TABLE `remarks_desc` (
  `remark_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `date` varchar(30) DEFAULT NULL,
  `activities_category` int(2) NOT NULL DEFAULT 0 COMMENT '1. Mechanical Detail Parts Drawing & BOM\r\n2. Electrical Design & BOM\r\n3. Standard Parts Order & Arrival Date\r\n4. Production (Fabrication & Surface Treatment) \r\n5. Mechanical Assembly & Electrical Wiring\r\n6. Programming / Fitting & Testing \r\n7. Factory Acceptance / Client Buy-off\r\n8. Packaging & Delivery \r\n9. Site Installation ',
  `remark_desc` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `datetime_created` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `remark_img`
--

CREATE TABLE `remark_img` (
  `remarkImg_id` int(10) NOT NULL,
  `remark_id` int(10) NOT NULL,
  `img_path` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `siteinstallation`
--

CREATE TABLE `siteinstallation` (
  `siteinstallation_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `activity_status` int(2) NOT NULL DEFAULT 1 COMMENT '1. Not Started\r\n2. In-Progress\r\n3. On Hold\r\n4. Completed',
  `overall_progress` int(2) DEFAULT NULL COMMENT '1. On-Time\r\n2. Delayed',
  `progress_percentage` int(3) NOT NULL DEFAULT 0,
  `estimated_duration` varchar(30) DEFAULT NULL,
  `planned_start_date` varchar(30) DEFAULT NULL,
  `actual_start_date` varchar(30) DEFAULT NULL,
  `date_of_completion` varchar(30) DEFAULT NULL,
  `remarks_schedule` varchar(30) DEFAULT NULL,
  `verified_by` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `standardpartsorder`
--

CREATE TABLE `standardpartsorder` (
  `standardpartorder_id` int(10) NOT NULL,
  `job_no` varchar(30) NOT NULL,
  `activity_status` int(2) NOT NULL DEFAULT 1 COMMENT '1. Not Started\r\n2. In Progress\r\n3. On Hold\r\n4. Completed',
  `overall_progress` int(2) DEFAULT NULL COMMENT '1. On-Time\r\n2. Delayed',
  `progress_percentage` int(3) NOT NULL DEFAULT 0,
  `estimated_duration` varchar(30) DEFAULT NULL,
  `planned_start_date` varchar(30) DEFAULT NULL,
  `actual_start_date` varchar(30) DEFAULT NULL,
  `date_of_completion` varchar(30) DEFAULT NULL,
  `remarks_schedule` varchar(30) DEFAULT NULL,
  `verified_by` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`account_id`);

--
-- Indexes for table `electricaldesign`
--
ALTER TABLE `electricaldesign`
  ADD PRIMARY KEY (`electricaldesign_id`),
  ADD KEY `job_no` (`job_no`);

--
-- Indexes for table `factoryacceptance`
--
ALTER TABLE `factoryacceptance`
  ADD PRIMARY KEY (`factoryacceptance_id`),
  ADD KEY `job_no` (`job_no`);

--
-- Indexes for table `job_specs`
--
ALTER TABLE `job_specs`
  ADD PRIMARY KEY (`job_no`);

--
-- Indexes for table `job_specs_item`
--
ALTER TABLE `job_specs_item`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `job_no` (`job_no`);

--
-- Indexes for table `job_specs_others`
--
ALTER TABLE `job_specs_others`
  ADD PRIMARY KEY (`others_id`),
  ADD KEY `job_no` (`job_no`);

--
-- Indexes for table `job_specs_requirement`
--
ALTER TABLE `job_specs_requirement`
  ADD PRIMARY KEY (`requirement_id`),
  ADD KEY `job_no` (`job_no`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `job_no` (`job_no`),
  ADD KEY `pr_no` (`pr_no`),
  ADD KEY `pr_item_id` (`pr_item_id`);

--
-- Indexes for table `mechanicalassembly`
--
ALTER TABLE `mechanicalassembly`
  ADD PRIMARY KEY (`mechanicalassembly_id`),
  ADD KEY `job_no` (`job_no`);

--
-- Indexes for table `mechanicaldesign`
--
ALTER TABLE `mechanicaldesign`
  ADD PRIMARY KEY (`mechanicaldesign_id`),
  ADD KEY `FK` (`job_no`);

--
-- Indexes for table `packagingdelivery`
--
ALTER TABLE `packagingdelivery`
  ADD PRIMARY KEY (`packagingdelivery_id`),
  ADD KEY `job_no` (`job_no`);

--
-- Indexes for table `pc_final_report`
--
ALTER TABLE `pc_final_report`
  ADD PRIMARY KEY (`finalReport_id`);

--
-- Indexes for table `pc_pdi_report`
--
ALTER TABLE `pc_pdi_report`
  ADD PRIMARY KEY (`pdiReport_id`);

--
-- Indexes for table `pc_progress_report`
--
ALTER TABLE `pc_progress_report`
  ADD PRIMARY KEY (`progressReport_id`),
  ADD KEY `job_no` (`job_no`);

--
-- Indexes for table `production`
--
ALTER TABLE `production`
  ADD PRIMARY KEY (`production_id`),
  ADD KEY `job_no` (`job_no`);

--
-- Indexes for table `programmingtesting`
--
ALTER TABLE `programmingtesting`
  ADD PRIMARY KEY (`programmingtesting_id`),
  ADD KEY `job_no` (`job_no`);

--
-- Indexes for table `purchase_requisition`
--
ALTER TABLE `purchase_requisition`
  ADD PRIMARY KEY (`pr_no`),
  ADD KEY `job_no` (`job_no`);

--
-- Indexes for table `purchase_requisition_item`
--
ALTER TABLE `purchase_requisition_item`
  ADD PRIMARY KEY (`pr_item_id`),
  ADD KEY `pr_no` (`pr_no`);

--
-- Indexes for table `remarks_desc`
--
ALTER TABLE `remarks_desc`
  ADD PRIMARY KEY (`remark_id`),
  ADD KEY `remarks_desc_ibfk_1` (`job_no`);

--
-- Indexes for table `remark_img`
--
ALTER TABLE `remark_img`
  ADD PRIMARY KEY (`remarkImg_id`),
  ADD KEY `remark_id` (`remark_id`);

--
-- Indexes for table `siteinstallation`
--
ALTER TABLE `siteinstallation`
  ADD PRIMARY KEY (`siteinstallation_id`),
  ADD KEY `job_no` (`job_no`);

--
-- Indexes for table `standardpartsorder`
--
ALTER TABLE `standardpartsorder`
  ADD PRIMARY KEY (`standardpartorder_id`),
  ADD KEY `job_no` (`job_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `account_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `electricaldesign`
--
ALTER TABLE `electricaldesign`
  MODIFY `electricaldesign_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `factoryacceptance`
--
ALTER TABLE `factoryacceptance`
  MODIFY `factoryacceptance_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_specs_item`
--
ALTER TABLE `job_specs_item`
  MODIFY `item_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_specs_others`
--
ALTER TABLE `job_specs_others`
  MODIFY `others_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_specs_requirement`
--
ALTER TABLE `job_specs_requirement`
  MODIFY `requirement_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `log_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mechanicalassembly`
--
ALTER TABLE `mechanicalassembly`
  MODIFY `mechanicalassembly_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mechanicaldesign`
--
ALTER TABLE `mechanicaldesign`
  MODIFY `mechanicaldesign_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `packagingdelivery`
--
ALTER TABLE `packagingdelivery`
  MODIFY `packagingdelivery_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pc_final_report`
--
ALTER TABLE `pc_final_report`
  MODIFY `finalReport_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pc_pdi_report`
--
ALTER TABLE `pc_pdi_report`
  MODIFY `pdiReport_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pc_progress_report`
--
ALTER TABLE `pc_progress_report`
  MODIFY `progressReport_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `production`
--
ALTER TABLE `production`
  MODIFY `production_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `programmingtesting`
--
ALTER TABLE `programmingtesting`
  MODIFY `programmingtesting_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_requisition`
--
ALTER TABLE `purchase_requisition`
  MODIFY `pr_no` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_requisition_item`
--
ALTER TABLE `purchase_requisition_item`
  MODIFY `pr_item_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `remarks_desc`
--
ALTER TABLE `remarks_desc`
  MODIFY `remark_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `remark_img`
--
ALTER TABLE `remark_img`
  MODIFY `remarkImg_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `siteinstallation`
--
ALTER TABLE `siteinstallation`
  MODIFY `siteinstallation_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `standardpartsorder`
--
ALTER TABLE `standardpartsorder`
  MODIFY `standardpartorder_id` int(10) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
