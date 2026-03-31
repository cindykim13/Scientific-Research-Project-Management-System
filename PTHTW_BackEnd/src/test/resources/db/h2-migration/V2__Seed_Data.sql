-- ==============================================================================
-- H2 TEST SEED DATA — mirrors V2__Seed_Data.sql from production.
-- Key difference: is_active column is included in every users INSERT
-- because the column is NOT NULL and the H2 schema no longer applies a
-- DEFAULT when using explicit column lists (MySQL implicit DEFAULT still works,
-- but being explicit avoids any H2/MySQL-mode edge cases).
-- ==============================================================================

-- 1. DEPARTMENTS (identical to production)
INSERT INTO departments (department_id, department_code, department_name, contact_email, contact_phone, is_active)
VALUES
(1, 'QLKH', 'Phòng Quản lý Khoa học',    'qlkh@university.edu.vn',      '02831234567', 1),
(2, 'CNTT', 'Khoa Công nghệ Thông tin',   'fit@university.edu.vn',       '02831234568', 1),
(3, 'KT',   'Khoa Kinh tế',               'economics@university.edu.vn', '02831234569', 1),
(4, 'CNSH', 'Khoa Công nghệ Sinh học',    'biotech@university.edu.vn',   '02831234570', 1);

-- 2. USERS (is_active column added — all accounts active by default)
-- BCrypt hash for default password 'password123'
INSERT INTO users (user_id, email, password_hash, full_name, academic_title, system_role, is_first_login, is_active, department_id)
VALUES
(1, 'admin@university.edu.vn',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O',
    'Quản trị viên Hệ thống', 'ThS', 'ADMIN', 1, 1, NULL),

(2, 'manager.qlkh@university.edu.vn',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O',
    'Nguyễn Quản Lý', 'TS', 'MANAGER', 1, 1, 1),

(3, 'dean.fit@university.edu.vn',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O',
    'Trần Trưởng Khoa', 'PGS.TS', 'DEPT_HEAD', 1, 1, 2),

(4, 'dean.eco@university.edu.vn',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O',
    'Lê Phụ Trách', 'TS', 'DEPT_HEAD', 1, 1, 3),

(5, 'researcher.fit1@university.edu.vn',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O',
    'Phạm Giảng Viên Một', 'ThS', 'RESEARCHER', 1, 1, 2),

(6, 'researcher.fit2@university.edu.vn',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O',
    'Hoàng Giảng Viên Hai', 'TS', 'RESEARCHER', 1, 1, 2),

(7, 'expert.council1@university.edu.vn',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O',
    'Vũ Chuyên Gia', 'GS.TS', 'COUNCIL', 1, 1, NULL),

(8, 'expert.council2@university.edu.vn',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.7uXCf1O',
    'Đặng Phản Biện', 'PGS.TS', 'COUNCIL', 1, 1, NULL);
