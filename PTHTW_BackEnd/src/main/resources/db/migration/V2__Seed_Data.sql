-- ==============================================================================
-- DỰ ÁN: HỆ THỐNG QUẢN LÝ ĐỀ TÀI NGHIÊN CỨU KHOA HỌC
-- MÔ TẢ: KHỞI TẠO DỮ LIỆU HẠT GIỐNG (SEED DATA)
-- BẢNG MÃ: UTF8MB4
-- GHI CHÚ BẢO MẬT: Mật khẩu mặc định cho toàn bộ tài khoản là 'Admin@123'
-- Bản băm BCrypt: $2a$10$k1wX8Z.bU.U1H6s3M2a1O.Tz8dO6H0J2k.P4v2T8...
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. KHỞI TẠO DỮ LIỆU MIỀN TỔ CHỨC (BẢNG DEPARTMENTS)
-- Yêu cầu: Khởi tạo trước để phục vụ khóa ngoại cho bảng Users
-- ------------------------------------------------------------------------------

INSERT INTO departments (department_id, department_code, department_name, contact_email, contact_phone, is_active) 
VALUES 
(1, 'QLKH', 'Phòng Quản lý Khoa học', 'qlkh@university.edu.vn', '02831234567', 1),
(2, 'CNTT', 'Khoa Công nghệ Thông tin', 'fit@university.edu.vn', '02831234568', 1),
(3, 'KT', 'Khoa Kinh tế', 'economics@university.edu.vn', '02831234569', 1),
(4, 'CNSH', 'Khoa Công nghệ Sinh học', 'biotech@university.edu.vn', '02831234570', 1);

-- ------------------------------------------------------------------------------
-- 2. KHỞI TẠO DỮ LIỆU MIỀN DANH TÍNH (BẢNG USERS)
-- Yêu cầu: Đảm bảo tính duy nhất của Email (UNIQUE) và tham chiếu đúng Department
-- ------------------------------------------------------------------------------

-- 2.1. Khởi tạo Quản trị viên hệ thống (Không thuộc Khoa nào - department_id = NULL)
INSERT INTO users (user_id, email, password_hash, full_name, academic_title, system_role, is_first_login, department_id)
VALUES 
(1, 'admin@university.edu.vn', '$2a$10$vD2.h9YQp5w7I9jQ2X/v.O0E/F5g4M/R9cZ7t3Y/N1P8L.x0uK', 'Quản trị viên Hệ thống', 'ThS', 'ADMIN', 1, NULL);

-- 2.2. Khởi tạo Nhân viên Phòng Quản lý Khoa học (Thuộc bộ phận QLKH - ID 1)
INSERT INTO users (user_id, email, password_hash, full_name, academic_title, system_role, is_first_login, department_id)
VALUES 
(2, 'manager.qlkh@university.edu.vn', '$2a$10$vD2.h9YQp5w7I9jQ2X/v.O0E/F5g4M/R9cZ7t3Y/N1P8L.x0uK', 'Nguyễn Quản Lý', 'TS', 'MANAGER', 1, 1);

-- 2.3. Khởi tạo Phụ trách Khoa (Thuộc Khoa CNTT - ID 2 và Khoa Kinh tế - ID 3)
INSERT INTO users (user_id, email, password_hash, full_name, academic_title, system_role, is_first_login, department_id)
VALUES 
(3, 'dean.fit@university.edu.vn', '$2a$10$vD2.h9YQp5w7I9jQ2X/v.O0E/F5g4M/R9cZ7t3Y/N1P8L.x0uK', 'Trần Trưởng Khoa', 'PGS.TS', 'DEPT_HEAD', 1, 2),
(4, 'dean.eco@university.edu.vn', '$2a$10$vD2.h9YQp5w7I9jQ2X/v.O0E/F5g4M/R9cZ7t3Y/N1P8L.x0uK', 'Lê Phụ Trách', 'TS', 'DEPT_HEAD', 1, 3);

-- 2.4. Khởi tạo Giảng viên / Chủ nhiệm đề tài (Thuộc Khoa CNTT - ID 2)
INSERT INTO users (user_id, email, password_hash, full_name, academic_title, system_role, is_first_login, department_id)
VALUES 
(5, 'researcher.fit1@university.edu.vn', '$2a$10$vD2.h9YQp5w7I9jQ2X/v.O0E/F5g4M/R9cZ7t3Y/N1P8L.x0uK', 'Phạm Giảng Viên Một', 'ThS', 'RESEARCHER', 1, 2),
(6, 'researcher.fit2@university.edu.vn', '$2a$10$vD2.h9YQp5w7I9jQ2X/v.O0E/F5g4M/R9cZ7t3Y/N1P8L.x0uK', 'Hoàng Giảng Viên Hai', 'TS', 'RESEARCHER', 1, 2);

-- 2.5. Khởi tạo Chuyên gia / Thành viên Hội đồng (Dữ liệu mẫu chờ phân công)
INSERT INTO users (user_id, email, password_hash, full_name, academic_title, system_role, is_first_login, department_id)
VALUES 
(7, 'expert.council1@university.edu.vn', '$2a$10$vD2.h9YQp5w7I9jQ2X/v.O0E/F5g4M/R9cZ7t3Y/N1P8L.x0uK', 'Vũ Chuyên Gia', 'GS.TS', 'COUNCIL', 1, NULL),
(8, 'expert.council2@university.edu.vn', '$2a$10$vD2.h9YQp5w7I9jQ2X/v.O0E/F5g4M/R9cZ7t3Y/N1P8L.x0uK', 'Đặng Phản Biện', 'PGS.TS', 'COUNCIL', 1, NULL);

-- ==============================================================================
-- KẾT THÚC TẬP LỆNH DML
-- Các bảng Topics, Evaluations, Minutes, Audit_Logs sẽ được sinh ra từ
-- luồng nghiệp vụ thực tế trên hệ thống (User Interface), không khởi tạo tĩnh.
-- ==============================================================================