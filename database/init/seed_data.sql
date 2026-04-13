-- MySQL dump 10.13  Distrib 8.0.45, for Linux (aarch64)
--
-- Host: localhost    Database: research_management_db
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` (`audit_log_id`, `previous_status`, `new_status`, `action_timestamp`, `feedback_message`, `topic_id`, `actor_id`) VALUES (1,'DRAFT','PENDING_REVIEW','2026-04-07 13:37:11','submit for review',1,9),(2,'DRAFT','PENDING_REVIEW','2026-04-09 18:21:58',NULL,5,10),(3,'DRAFT','PENDING_REVIEW','2026-04-09 20:19:53',NULL,6,10),(4,'DRAFT','PENDING_REVIEW','2026-04-09 23:38:57',NULL,7,10);
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `council_members`
--

LOCK TABLES `council_members` WRITE;
/*!40000 ALTER TABLE `council_members` DISABLE KEYS */;
INSERT INTO `council_members` (`council_member_id`, `council_role`, `council_id`, `user_id`) VALUES (1,'PRESIDENT',1,14),(2,'SECRETARY',1,15),(3,'MEMBER',1,16),(4,'REVIEWER',1,17),(5,'REVIEWER',1,18),(6,'PRESIDENT',2,20),(7,'SECRETARY',2,21),(8,'REVIEWER',2,22),(9,'REVIEWER',2,23);
/*!40000 ALTER TABLE `council_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `councils`
--

LOCK TABLES `councils` WRITE;
/*!40000 ALTER TABLE `councils` DISABLE KEYS */;
INSERT INTO `councils` (`council_id`, `council_name`, `meeting_date`, `meeting_time`, `meeting_location`) VALUES (1,'Hội đồng Xét duyệt Chuyên môn Số 1','2026-11-01','08:00:00',''),(2,'Hội đồng xét duyệt đợt 1 / 2026','2026-12-01','08:00:00','Phòng P.101'),(3,'Hội đồng Xét duyệt Chuyên môn Số 3','2026-12-12','08:00:00','');
/*!40000 ALTER TABLE `councils` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` (`department_id`, `department_code`, `department_name`, `contact_email`, `contact_phone`, `is_active`) VALUES (1,'QLKH','Phòng Quản lý Khoa học','qlkh@university.edu.vn','02831234567',1),(2,'CNTT','Khoa Công nghệ Thông tin','fit@university.edu.vn','02831234568',1),(3,'KT','Khoa Kinh tế','economics@university.edu.vn','02831234569',1),(4,'CNSH','Khoa Công nghệ Sinh học','biotech@university.edu.vn','02831234570',1),(5,'QA-DEPT','Hội đồng Khoa học Giả lập QA',NULL,NULL,1);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `evaluations`
--

LOCK TABLES `evaluations` WRITE;
/*!40000 ALTER TABLE `evaluations` DISABLE KEYS */;
INSERT INTO `evaluations` (`evaluation_id`, `score_urgency`, `score_content`, `score_objectives`, `score_methodology`, `score_feasibility`, `score_capacity`, `score_products`, `total_score`, `general_comment`, `recommended_decision`, `submission_status`, `council_member_id`, `topic_id`) VALUES (1,10.00,15.00,15.00,15.00,15.00,10.00,10.00,90.00,'Chủ tịch đánh giá Tốt','APPROVE','SUBMITTED',1,2),(2,10.00,10.00,15.00,15.00,10.00,10.00,10.00,80.00,'Ủy viên đánh giá Khá','APPROVE','SUBMITTED',3,2),(3,10.00,15.00,10.00,15.00,15.00,10.00,10.00,85.00,'PB1: Cần làm rõ phương pháp','APPROVE_WITH_CONDITIONS','SUBMITTED',4,2),(4,15.00,15.00,15.00,15.00,15.00,10.00,10.00,95.00,'PB2: Đề tài xuất sắc','APPROVE','SUBMITTED',5,2);
/*!40000 ALTER TABLE `evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` (`installed_rank`, `version`, `description`, `type`, `script`, `checksum`, `installed_by`, `installed_on`, `execution_time`, `success`) VALUES (1,'1','Init Schema','SQL','V1__Init_Schema.sql',1171583153,'root','2026-04-07 06:02:10',335,1),(2,'2','Seed Data','SQL','V2__Seed_Data.sql',-748562827,'root','2026-04-07 06:02:10',13,1),(3,'3','Add users is active','SQL','V3__Add_users_is_active.sql',522811269,'root','2026-04-07 06:02:10',25,1),(4,'4','Update password hashes','SQL','V4__Update_password_hashes.sql',-219861371,'root','2026-04-07 06:02:10',5,1),(5,'5','Topic scoped evaluations and minutes','SQL','V5__Topic_scoped_evaluations_and_minutes.sql',-1435185644,'root','2026-04-07 06:02:11',242,1),(6,'6','Foundational auth tokens','SQL','V6__Foundational_auth_tokens.sql',-322483545,'root','2026-04-07 06:02:11',52,1),(7,'7','Notification inbox','SQL','V7__Notification_inbox.sql',281716886,'root','2026-04-07 06:34:58',122,1),(8,'8','Expand topics rich text columns','SQL','V8__Expand_topics_rich_text_columns.sql',2112569880,'root','2026-04-09 09:12:48',428,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `minutes`
--

LOCK TABLES `minutes` WRITE;
/*!40000 ALTER TABLE `minutes` DISABLE KEYS */;
INSERT INTO `minutes` (`minute_id`, `average_score`, `synthesized_comments`, `final_decision`, `legal_confirmation`, `created_at`, `council_id`, `topic_id`) VALUES (1,87.50,'System auto-initialized','PENDING',0,'2026-04-08 03:08:25',1,2);
/*!40000 ALTER TABLE `minutes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` (`notification_id`, `recipient_user_id`, `notification_type`, `title`, `body`, `resource_type`, `resource_id`, `created_at`, `read_at`) VALUES (1,9,'TOPIC_STATUS_CHANGED','Topic status changed: TOPIC-E9F4D6D9','Topic TOPIC-E9F4D6D9 transitioned to PENDING_REVIEW (actor=notify.researcher@local.test)','TOPIC',1,'2026-04-07 13:37:10.738501','2026-04-07 13:37:10.897403'),(2,10,'TOPIC_STATUS_CHANGED','Topic status changed: TOPIC-D5BBD561','Topic TOPIC-D5BBD561 transitioned to PENDING_REVIEW (actor=researcher_thuong@ou.edu.vn)','TOPIC',5,'2026-04-09 18:21:57.631105','2026-04-09 18:22:57.159183'),(3,10,'TOPIC_STATUS_CHANGED','Topic status changed: TOPIC-73968F0A','Topic TOPIC-73968F0A transitioned to PENDING_REVIEW (actor=researcher_thuong@ou.edu.vn)','TOPIC',6,'2026-04-09 20:19:52.778309','2026-04-09 22:31:07.867557'),(4,10,'TOPIC_STATUS_CHANGED','Topic status changed: TOPIC-F1970F4E','Topic TOPIC-F1970F4E transitioned to PENDING_REVIEW (actor=researcher_thuong@ou.edu.vn)','TOPIC',7,'2026-04-09 23:38:57.295863',NULL);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` (`id`, `user_id`, `token_hash`, `expires_at`, `created_at`) VALUES (1,9,'4485f510411adb13a16dd8f291814e02dedc5fb5ae9d4f04bca6eade79af322f','2026-04-14 06:36:23.590072','2026-04-07 06:36:23.590079'),(2,9,'1006933474d5bcf99e6f57fc08c1be0cd54124d7cb3902659877636b517022b8','2026-04-14 06:37:10.505748','2026-04-07 06:37:10.505752'),(52,15,'734471710dd669b10c01827ff38bdec8f6d507d222e31e6257330b6dcf03d195','2026-04-18 14:58:00.367183','2026-04-11 14:58:00.367184');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `revoked_jwt`
--

LOCK TABLES `revoked_jwt` WRITE;
/*!40000 ALTER TABLE `revoked_jwt` DISABLE KEYS */;
INSERT INTO `revoked_jwt` (`id`, `token_hash`, `expires_at`, `revoked_at`) VALUES (19,'96fca93b1f11537211ce5d07418f5936369c8d0db84f5f3bcb4712f5d8deb2ea','2026-04-13 14:00:30.000000','2026-04-12 14:55:44.900494'),(20,'f832f0a0655eb6e72d287115d7a317956b72d615075954c9520e82f2911042ae','2026-04-13 14:56:26.000000','2026-04-12 14:57:13.545640');
/*!40000 ALTER TABLE `revoked_jwt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `topic_attachments`
--

LOCK TABLES `topic_attachments` WRITE;
/*!40000 ALTER TABLE `topic_attachments` DISABLE KEYS */;
INSERT INTO `topic_attachments` (`attachment_id`, `document_type`, `file_uri`, `uploaded_at`, `topic_id`, `file_version`) VALUES (1,'application/pdf','uploads/attachments/eb0f525f-9ffd-4d02-9bbd-52014c51ca79_proposal.pdf','2026-04-09 23:04:13',7,2),(2,'application/pdf','uploads/attachments/64ea4047-8ae1-4120-a59e-82ba190c4e5b_massive_file.pdf','2026-04-09 23:35:12',7,3);
/*!40000 ALTER TABLE `topic_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `topics`
--

LOCK TABLES `topics` WRITE;
/*!40000 ALTER TABLE `topics` DISABLE KEYS */;
INSERT INTO `topics` (`topic_id`, `topic_code`, `title_vn`, `title_en`, `research_type`, `research_field`, `urgency_statement`, `general_objective`, `specific_objectives`, `research_approach`, `research_methods`, `research_scope`, `expected_products_type1`, `expected_products_type2`, `budget_explanation`, `training_plan`, `implementation_plan`, `duration_months`, `expected_budget`, `submission_date`, `topic_status`, `file_version`, `investigator_id`, `managing_department_id`, `assigned_council_id`) VALUES (1,'TOPIC-E9F4D6D9','','Notification trigger topic','BASIC','AI',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,10000.00,'2026-04-07 13:36:24','PENDING_REVIEW',1,9,2,NULL),(2,'TOPIC-6ABA7DDE','','Semantic Overlap Prevention Mechanisanism','APPLIED','INFORMATION_TECHNOLOGY',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,12,150000.00,'2026-04-07 18:28:33','PENDING_COUNCIL',1,10,2,1),(3,'TOPIC-007AE782','Nghiên cứu ứng dụng Data Science','Applied Data Science Research','APPLIED','INFORMATION_TECHNOLOGY',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,150000.00,'2026-04-07 18:29:11','DEPT_APPROVED',1,10,1,NULL),(4,'TOPIC-6B71B8B0','Nghiên cứu các phương pháp học máy hiện đại','Modern ML Algorithms Research','BASIC','INFORMATION_TECHNOLOGY',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10,150000.00,'2026-04-07 18:29:26','PENDING_COUNCIL',1,10,1,1),(5,'TOPIC-D5BBD561','Ứng dụng thuật toán học sâu trong việc chẩn đoán sớm bệnh lý võng mạc từ hình ảnh đáy mắt','Application of Deep Learning Algorithms for Early Diagnosis of Retinal Pathology from Fundus Images','APPLIED','INFORMATION_TECHNOLOGY','<p>Các bệnh lý về võng mạc (như biến chứng tiểu đường) là nguyên nhân hàng đầu gây mù lòa nhưng thường khó phát hiện ở giai đoạn đầu. Việc phát triển một hệ thống tự động hỗ trợ chẩn đoán là vô cùng cấp thiết nhằm giảm tải cho bệnh viện tuyến cơ sở.</p>','<p>Xây dựng mô hình trí tuệ nhân tạo có khả năng nhận diện và phân loại chính xác các dấu hiệu bệnh lý võng mạc từ ảnh chụp đáy mắt, hỗ trợ bác sĩ trong việc tầm soát sớm.</p>','<ul><li>Thu thập và tiền xử lý bộ dữ liệu gồm ít nhất 5.000 hình ảnh đáy mắt đã được nhãn hóa.</li><li>Thiết kế và huấn luyện mô hình mạng nơ-ron tích chập (CNN) đạt độ chính xác trên 90%.</li></ul>','<p>Tiếp cận theo hướng <strong>Supervised Learning</strong> (Học có giám sát) kết hợp với kỹ thuật <strong>Transfer Learning</strong> trên các kiến trúc pre-trained như ResNet50 hoặc EfficientNet.</p>','<p>1. Nghiên cứu tài liệu.<br>2. Thu thập dữ liệu (Data Augmentation).<br>3. Xây dựng mô hình bằng PyTorch.<br>4. Đánh giá qua ma trận nhầm lẫn (Confusion Matrix).</p>','<p>Nghiên cứu giới hạn trên tập dữ liệu hình ảnh đáy mắt của bệnh nhân tại Bệnh viện Mắt TP.HCM trong giai đoạn 2020-2025.</p>','<ul><li>01 Báo cáo tổng kết đề tài.</li><li>01 Mã nguồn phần mềm chẩn đoán (đóng gói dạng Docker container).</li></ul>','<ul><li>01 Bài báo công bố trên tạp chí khoa học chuyên ngành trong nước.</li></ul>','<p>Kinh phí dự kiến chi trả cho: Mua sắm thiết bị GPU chuyên dụng (40%), chi phí thuê chuyên gia dán nhãn dữ liệu y tế (30%), chi phí quản lý và hội thảo (30%).</p>','<p>Hỗ trợ đào tạo 02 sinh viên đại học hoàn thành khóa luận tốt nghiệp ngành Khoa học Máy tính.</p>','<ul><li><strong>Tháng 1-3:</strong> Thu thập dữ liệu.</li><li><strong>Tháng 4-8:</strong> Huấn luyện mô hình.</li><li><strong>Tháng 9-12:</strong> Thử nghiệm lâm sàng và viết báo cáo.</li></ul>',12,150000000.00,'2026-04-09 16:39:37','PENDING_REVIEW',1,10,1,NULL),(6,'TOPIC-73968F0A','Ứng dụng trí tuệ nhân tạo trong dự báo nhu cầu tiêu dùng tại Việt Nam','Application of Artificial Intelligence in Consumer Demand Forecasting in Vietnam','BASIC','Công nghệ thông tin và Trí tuệ nhân tạo','<h3>Nhu cầu dự báo chính xác hành vi tiêu dùng ngày càng cao trong bối cảnh chuyển đổi số.</h3>','<p>Xây dựng mô hình AI nhằm dự báo nhu cầu tiêu dùng với độ chính xác cao, hỗ trợ ra quyết định kinh doanh</p>','<ul><li><p>Thu thập và xử lý bộ dữ liệu tiêu dùng</p></li><li><p>Phân tích các yếu tố ảnh hưởng đến hành vi mua sắm</p></li><li><p>Xây dựng và huấn luyện mô hình dự báo</p></li><li><p>Đánh giá và tối ưu hiệu quả mô hình</p></li><li><p>Đề xuất giải pháp ứng dụng thực tiễn</p></li></ul>','<ul><li><p>Tiếp cận liên ngành giữa khoa học dữ liệu, kinh tế học và công nghệ thông tin</p></li><li><p>Ứng dụng mô hình học máy (Machine Learning) và học sâu (Deep Learning)</p></li><li><p>Kết hợp phân tích dữ liệu lớn (Big Data) từ các nền tảng thương mại điện tử</p></li></ul>','<ul><li><p><strong>Phương pháp thu thập dữ liệu:</strong> Web scraping, khảo sát, dữ liệu thứ cấp</p></li><li><p><strong>Phương pháp phân tích:</strong></p><ul><li><p>Thống kê mô tả</p></li><li><p>Hồi quy tuyến tính</p></li><li><p>Machine Learning (Random Forest, XGBoost)</p></li></ul></li><li><p><strong>Công cụ:</strong> Python, TensorFlow, Power BI</p></li><li><p><strong>Phương pháp đánh giá:</strong> MAE, RMSE</p></li></ul>','Đối tượng: Hành vi tiêu dùng của khách hàng\nPhạm vi:\nKhông gian: Việt Nam (tập trung vào TP.HCM và Hà Nội)\nThời gian: Dữ liệu từ 2020–2025\nNội dung: Dự báo nhu cầu tiêu dùng hàng hóa bán lẻ','<p>01 bài báo khoa học đăng tạp chí</p>',NULL,'<ul><li><p>Thu thập dữ liệu: 10.000.000</p></li><li><p>Phần mềm &amp; công cụ: 5.000.000</p></li><li><p>Nhân công nghiên cứu: 30.000.000</p></li><li><p>Hội thảo / công bố: 10.000.000</p></li><li><p>Chi phí khác: 5.000.000</p></li></ul>',NULL,NULL,10,60000000.00,'2026-04-09 20:15:24','PENDING_REVIEW',1,10,1,NULL),(7,'TOPIC-F1970F4E','Khai thác dữ liệu hành vi số từ mạng xã hội để dự đoán xu hướng tiêu dùng xanh của sinh viên Việt Nam','Mining Social Media Behavioral Data to Predict Green Consumption Trends among Vietnamese University Students','BASIC','Công nghệ thông tin và Trí tuệ nhân tạo','<ul><li><p>Biến đổi khí hậu và tiêu dùng bền vững đang là vấn đề toàn cầu.</p></li><li><p>Sinh viên là lực lượng tiêu dùng trẻ, có khả năng dẫn dắt xu hướng.</p></li><li><p>Các nghiên cứu hiện tại chủ yếu dựa trên khảo sát, thiếu khai thác dữ liệu số thực tế.</p></li></ul>','<p>Xây dựng mô hình phân tích dữ liệu hành vi số nhằm dự đoán xu hướng tiêu dùng xanh của sinh viên, góp phần thúc đẩy phát triển bền vững và hỗ trợ doanh nghiệp định hướng chiến lược sản phẩm.</p>','<ul><li><p>Xác định các chỉ báo hành vi tiêu dùng xanh từ dữ liệu mạng xã hội (like, share, comment).</p></li><li><p>Thu thập và xử lý dữ liệu từ các nền tảng mạng xã hội phổ biến.</p></li><li><p>Xây dựng mô hình dự đoán xu hướng tiêu dùng xanh.</p></li><li><p>Đánh giá tác động của yếu tố nhận thức môi trường đến hành vi tiêu dùng.</p></li><li><p>Đề xuất giải pháp ứng dụng cho doanh nghiệp và tổ chức xã hội.</p></li></ul>','<ul><li><p>Tiếp cận theo hướng <strong>data-driven (dựa trên dữ liệu lớn)</strong> thay vì chỉ khảo sát truyền thống.</p></li><li><p>Kết hợp giữa khoa học dữ liệu, truyền thông số và phát triển bền vững.</p></li><li><p>Khai thác dữ liệu thực tế từ môi trường số (digital footprint).</p></li></ul>','<ul><li><p>Thu thập dữ liệu từ mạng xã hội (Facebook, TikTok, Instagram – dữ liệu công khai).</p></li><li><p>Xử lý dữ liệu bằng kỹ thuật NLP (xử lý ngôn ngữ tự nhiên).</p></li><li><p>Áp dụng các mô hình học máy (Naive Bayes, Random Forest, Neural Network).</p></li><li><p>Phân tích cảm xúc (sentiment analysis) để xác định thái độ với tiêu dùng xanh.</p></li><li><p>Kiểm định mô hình bằng tập dữ liệu thực nghiệm.</p></li></ul>','Nội dung:\nTổng quan về tiêu dùng xanh và hành vi số.\nThu thập và xử lý dữ liệu mạng xã hội.\nXây dựng mô hình dự đoán.\nPhân tích kết quả và đề xuất giải pháp.\nPhạm vi:\nĐối tượng: Sinh viên sử dụng mạng xã hội tại Việt Nam.\nThời gian: 8–12 tháng.\nDữ liệu: Nội dung công khai trên mạng xã hội (không xâm phạm quyền riêng tư).','<p>01 bài báo khoa học (ưu tiên hội thảo hoặc tạp chí)</p><p>01 báo cáo nghiên cứu hoàn chỉnh</p>','<p>01 mô hình dự đoán xu hướng tiêu dùng xanh</p>',NULL,NULL,NULL,12,16000000.00,'2026-04-09 21:59:40','PENDING_REVIEW',3,10,1,NULL);
/*!40000 ALTER TABLE `topics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`user_id`, `email`, `password_hash`, `full_name`, `academic_title`, `system_role`, `is_first_login`, `is_active`, `department_id`) VALUES (1,'admin@university.edu.vn','$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O','Quản trị viên Hệ thống','ThS','ADMIN',1,1,NULL),(2,'manager.qlkh@university.edu.vn','$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O','Nguyễn Quản Lý','TS','MANAGER',1,1,1),(3,'dean.fit@university.edu.vn','$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O','Trần Trưởng Khoa','PGS.TS','DEPT_HEAD',1,1,2),(4,'dean.eco@university.edu.vn','$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O','Lê Phụ Trách','TS','DEPT_HEAD',1,1,3),(5,'researcher.fit1@university.edu.vn','$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O','Phạm Giảng Viên Một','ThS','RESEARCHER',1,1,2),(6,'researcher.fit2@university.edu.vn','$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O','Hoàng Giảng Viên Hai','TS','RESEARCHER',1,1,2),(7,'expert.council1@university.edu.vn','$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O','Vũ Chuyên Gia','GS.TS','COUNCIL',1,1,NULL),(8,'expert.council2@university.edu.vn','$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O','Đặng Phản Biện','PGS.TS','COUNCIL',1,1,NULL),(9,'notify.researcher@local.test','$2a$10$iF./eVKDEILYnJu6rX2q6.xzPx472VC20xOpIxIllLL5ZokcGgOWi','Notify Researcher',NULL,'RESEARCHER',0,1,NULL),(10,'researcher_thuong@ou.edu.vn','$2a$10$RsVCSU9y9bKB5rAaDamZA.1wlUGTBuSmc44r8O8yH9xGzUEGwbe9e','Nguyễn Thị Hoài Thương',NULL,'RESEARCHER',0,1,2),(11,'test_admin@ou.edu.vn','$2a$10$SV0oIfK9dn3Y6vnR.VWGFeOcMbi7HWMWdb7jYFojny2jCEkSE2uU.','QA Admin',NULL,'ADMIN',0,1,NULL),(12,'manager@ou.edu.vn','$2a$10$wUD.nMwcHuEL11zjCT16OuPZ8.cVstv0gqyzlbvDuvZLDbobZ7FoW','Trưởng Phòng NCKH',NULL,'MANAGER',0,1,NULL),(13,'dept_it@ou.edu.vn','$2a$10$12IldyMltO1lZYs01PiN3eV48RX6um3.mkBmfuHsrVugUfE629zYO','Trưởng Khoa IT',NULL,'DEPT_HEAD',0,1,NULL),(14,'president_5@test.com','$2a$10$Sw6dhYnI.HhdJZUiaWM5jOBuuWoFCa2qdrYAmqc8FmREkr/Z.a4YK','Chủ tịch Hội đồng',NULL,'COUNCIL',0,1,NULL),(15,'secretary_5@test.com','$2a$10$b5zDhIqUyppuVqse/3yMHeEMiOi98ideHKWEPkrFYT1Y1KzVh6rPG','Thư ký Hội đồng',NULL,'COUNCIL',0,1,NULL),(16,'member_5@test.com','$2a$10$d4WhYdKsGq2ncrKyF2htw.WkAaFfP6rPzwe4jOis/T/XWbckKbnJS','Ủy viên Hội đồng',NULL,'COUNCIL',1,1,NULL),(17,'reviewer1_5@test.com','$2a$10$d4WhYdKsGq2ncrKyF2htw.WkAaFfP6rPzwe4jOis/T/XWbckKbnJS','Phản biện 1',NULL,'COUNCIL',1,1,NULL),(18,'reviewer2_5@test.com','$2a$10$d4WhYdKsGq2ncrKyF2htw.WkAaFfP6rPzwe4jOis/T/XWbckKbnJS','Phản biện 2',NULL,'COUNCIL',1,1,NULL),(19,'researcher_5@test.com','$2a$10$d4WhYdKsGq2ncrKyF2htw.WkAaFfP6rPzwe4jOis/T/XWbckKbnJS','Chủ nhiệm Đề tài B',NULL,'RESEARCHER',1,1,NULL),(20,'president_2@test.com','$2a$10$d4WhYdKsGq2ncrKyF2htw.WkAaFfP6rPzwe4jOis/T/XWbckKbnJS','Chủ tịch Hội đồng',NULL,'COUNCIL',1,1,NULL),(21,'secretary_2@test.com','$2a$10$d4WhYdKsGq2ncrKyF2htw.WkAaFfP6rPzwe4jOis/T/XWbckKbnJS','Thư ký Hội đồng',NULL,'COUNCIL',1,1,NULL),(22,'member_2@test.com','$2a$10$d4WhYdKsGq2ncrKyF2htw.WkAaFfP6rPzwe4jOis/T/XWbckKbnJS','Ủy viên Hội đồng',NULL,'COUNCIL',1,1,NULL),(23,'reviewer_2@test.com','$2a$10$d4WhYdKsGq2ncrKyF2htw.WkAaFfP6rPzwe4jOis/T/XWbckKbnJS','Phản biện 1',NULL,'COUNCIL',1,1,NULL),(24,'reviewer_2_4@test.com','$2a$10$d4WhYdKsGq2ncrKyF2htw.WkAaFfP6rPzwe4jOis/T/XWbckKbnJS','Phản biện 2',NULL,'COUNCIL',1,1,NULL),(25,'researcher_2@test.com','$2a$10$ujY1VAKgyPao3ItnOv5fzuRdbF36c.4LP8e6ZVWYfORdJjeiUV3t2','Chủ nhiệm Đề tài C',NULL,'RESEARCHER',0,1,NULL),(26,'researcher_tester@ou.edu.vn','$2a$10$oF/CrQPHaRwVw5bLvnfoJ.gW4uTLLRgdbR.EaE67dEknZBpGjejg2','Trần Thế Anh',NULL,'RESEARCHER',0,1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-13  8:45:11
