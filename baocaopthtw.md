

---

### 1. TỔNG QUAN PHƯƠNG PHÁP LUẬN BIÊN SOẠN

Báo cáo này đệ trình cấu trúc phân rã chi tiết cho **CHƯƠNG 5. TRIỂN KHAI VÀ THIẾT KẾ HỆ THỐNG** thuộc khuôn khổ đồ án kỹ thuật phần mềm. Cấu trúc được thiết kế tuân thủ tiêu chuẩn **IEEE 1016-2009 (Standard for Information Technology—Systems Design—Software Design Descriptions)**.

Căn cứ vào yêu cầu đặc thù của đồ án (trọng số đánh giá nghiêng về Tầng Trình diễn - Frontend), cấu trúc mục lục dưới đây sẽ phân bổ 60% khối lượng học thuật để biện luận các quyết định kiến trúc tại máy khách (ReactJS), và 40% cho nền tảng máy chủ (Spring Boot) cùng cơ sở dữ liệu. Mọi tiểu mục đều đi kèm hướng dẫn biên soạn (Writing Guidelines) để sinh viên/kỹ sư điền nội dung chính xác.

---

### 2. CẤU TRÚC MỤC LỤC CHI TIẾT (DETAILED TABLE OF CONTENTS STRUCTURE)

Dưới đây là khung sườn chuẩn mực học thuật bắt buộc phải trình bày trong đồ án.

#### 5.1. Cấu hình Môi trường và Hệ sinh thái Phát triển
*Hướng dẫn biên soạn: Không liệt kê liệt kê chung chung. Phải đặc tả phiên bản phần mềm và lý do lựa chọn dựa trên tính ổn định và tiêu chuẩn công nghiệp.*

*   **5.1.1. Môi trường Máy khách (Client-side Environment):** Đặc tả Node.js (LTS), trình đóng gói Vite (tối ưu hóa HMR so với Webpack), thư viện cốt lõi React 19.
*   **5.1.2. Môi trường Máy chủ và Lưu trữ (Server & Storage Environment):** Đặc tả Java Development Kit (JDK 17/21 LTS), Spring Boot 3.x, và MySQL 8.0+.
*   **5.1.3. Công cụ Quản lý Mã nguồn và Tích hợp (SCM & Integration Tools):** Trình bày việc sử dụng Git, IDE (Cursor/VS Code/IntelliJ), công cụ kiểm thử API (Postman).

#### 5.2. Mô hình Kiến trúc Hệ thống Tổng thể (Overall System Architecture)
*Hướng dẫn biên soạn: Minh họa bằng Sơ đồ Kiến trúc Tổng thể (Architecture Diagram).*

*   **5.2.1. Kiến trúc Phân tách Khách - Chủ (Decoupled Client-Server Architecture):** Biện luận việc chia tách hệ thống thành 2 dự án độc lập. Tham chiếu luận án của **Roy Fielding** về việc các thành phần kiến trúc REST phải tiến hóa độc lập, không chia sẻ bộ nhớ.
*   **5.2.2. Giao thức Giao tiếp Mạng (Network Communication Protocol):** Trình bày luồng trao đổi dữ liệu qua HTTP/HTTPS với định dạng thông điệp (Payload) là JSON.

#### 5.3. Thiết kế và Hiện thực hóa Kiến trúc Máy khách (Frontend Architecture Implementation)
*Hướng dẫn biên soạn: ĐÂY LÀ TRỌNG TÂM CỦA CHƯƠNG. Cần trình bày quá trình tiến hóa từ nguyên mẫu tĩnh sang Ứng dụng Đơn trang (SPA) cấp doanh nghiệp.*

*   **5.3.1. Hệ sinh thái Công nghệ (Technology Stack)**
    *   Biện luận lựa chọn ReactJS kết hợp với Vite làm nền tảng xây dựng Ứng dụng Đơn trang (Single Page Application - SPA).
    *   Phân tích vai trò của các thư viện cốt lõi:
        *   **`react-router-dom`**: Xây dựng hệ thống định tuyến phía máy khách (Client-side Routing).
        *   **`axios`**: Thiết lập Tầng Giao tiếp Mạng (Network Communication Layer).
        *   **`zustand`**: Triển khai Mẫu Quản lý Trạng thái Toàn cục (Global State Management Pattern).
        *   **`react-hook-form` & `yup`**: Xây dựng Tầng Xác thực Dữ liệu tại máy khách (Client-side Validation), đối chiếu với tiêu chuẩn JSR-380 của Backend.

*   **5.3.2. Thiết kế Kiến trúc Dựa trên Thành phần (Component-Based Architecture)**
    *   Trình bày cấu trúc thư mục được chuẩn hóa theo Chức năng (Feature-based) và Vai trò (Role-based), tuân thủ nguyên lý Tách biệt Mối quan tâm (Separation of Concerns).
    *   Phân tích các cấp độ thành phần:
        *   **Thành phần Nguyên tử (Atomic Components):** Các khối xây dựng giao diện cơ bản (Button, Input, Badge).
        *   **Thành phần Phân tử (Molecular Components):** Các cụm giao diện có logic riêng (Form đăng nhập, Thanh tìm kiếm).
        *   **Thành phần Bố cục (Layout Components):** Khung giao diện chính (AppShell, Sidebar, TopBar).
        *   **Thành phần Trang (Page Components):** Nơi lắp ráp các thành phần để tạo ra một màn hình hoàn chỉnh.

*   **5.3.3. Tầng Giao tiếp Mạng và Quản lý Trạng thái Bất đồng bộ**
    *   **Thiết kế Đối tượng Axios Trung tâm và Bộ đánh chặn (Interceptors):**
        *   Mô tả chi tiết logic của Bộ đánh chặn Yêu cầu (Request Interceptor) trong việc tự động tiêm JWT vào tiêu đề HTTP.
        *   Trình bày Ma trận Xử lý Lỗi (Error Handling Matrix) của Bộ đánh chặn Phản hồi (Response Interceptor), đặc tả hành vi của hệ thống khi gặp các mã lỗi 401, 403, 404, 500.
    *   **Quản lý Trạng thái Toàn cục với Zustand:**
        *   Thiết kế cấu trúc của `authStore` (lưu trữ thông tin xác thực) và `uiStore` (quản lý trạng thái tải và thông báo).
        *   Biện luận việc sử dụng middleware `persist` để duy trì phiên đăng nhập.

*   **5.3.4. Hệ thống Định tuyến và Bảo vệ Ranh giới (Routing & Guards)**
    *   Trình bày cấu trúc của `createBrowserRouter`, bao gồm các tuyến đường lồng nhau (Nested Routes).
    *   Phân tích chi tiết mã nguồn và logic của Thành phần Bậc cao `<PrivateRoute>`, giải thích cách nó thực thi Kiểm soát Truy cập Dựa trên Vai trò (RBAC) tại phía máy khách.
*   **5.3.5. Hiện thực hóa các Biểu mẫu Nghiệp vụ Lõi (Core Business UI Implementation):**
    *   *Cơ sở lý thuyết:* Trình bày việc tích hợp `react-hook-form` kết hợp `yup` schema để xác thực dữ liệu đầu vào (Client-side Validation), giảm tải I/O cho máy chủ.
    *   *Nghiệp vụ 1:* Trình bày giao diện **Biểu mẫu Khởi tạo Đề tài Đa bước (Submission Wizard)** (Tích hợp Tiptap Rich Text và Dropzone Upload).
    *   *Nghiệp vụ 2:* Trình bày giao diện **Ma trận Đánh giá Chuyên gia (Split-pane Evaluation)** (Tích hợp PDF Viewer và Reactive Sliders tính điểm thời gian thực).
    *   *Nghiệp vụ 3:* Trình bày giao diện **Bảng điều khiển Thư ký (Secretary Polling Dashboard)** với cổng trạng thái khóa/mở nút lập biên bản.

#### 5.4. Thiết kế và Hiện thực hóa Kiến trúc Máy chủ (Backend Architecture Implementation)
*Hướng dẫn biên soạn: Trình bày sự tương thích của mã nguồn với Mô hình Miền (Domain Model) đã phân tích ở Chương 3/4.*

*   **5.4.1. Cấu trúc Phân tầng (N-Tier Architecture):** Trình bày sự phân tách Controller - Service - Repository. Tham chiếu nguyên lý **Domain-Driven Design (DDD)** của Eric Evans trong việc cấu trúc gói theo Ngữ cảnh Giới hạn (Bounded Contexts).
*   **5.4.2. Tầng Truy xuất Dữ liệu và Tối ưu hóa ORM (Data Access & ORM Optimization):**
    *   Trình bày việc sử dụng Spring Data JPA.
    *   Biện luận cách giải quyết bài toán hiệu năng **N+1 Select Problem** bằng kỹ thuật Tải lười (Lazy Loading) kết hợp `@EntityGraph` khi truy xuất chi tiết Đề tài.
*   **5.4.3. Tầng Dịch vụ và Máy trạng thái Hữu hạn (Service Layer & Finite State Machine):**
    *   Trình bày nguyên lý thiết kế Đối tượng Truyền tải (DTO Pattern - Martin Fowler) và việc sử dụng MapStruct để ánh xạ dữ liệu.
    *   Trình bày thuật toán chuyển đổi trạng thái đề tài có kiểm soát tiền điều kiện và việc đảm bảo Tính Nguyên tử (Atomicity) thông qua chú thích `@Transactional`.
*   **5.4.4. Tầng Giao diện Lập trình (API Presentation Layer):** Trình bày việc thiết kế điểm cuối chuẩn REST. Cung cấp hình ảnh minh họa tài liệu tự động sinh OpenAPI/Swagger UI 3.0.

#### 5.5. Triển khai Cơ sở dữ liệu Vật lý (Physical Database Implementation)
*Hướng dẫn biên soạn: Tập trung vào tính toàn vẹn và tối ưu.*

*   **5.5.1. Chiến lược Chuyển đổi Kiểu dữ liệu (Data Type Mapping):** Biện luận việc sử dụng `DECIMAL(5,2)` thay vì `FLOAT` (IEEE 754) để bảo toàn độ chính xác điểm học thuật.
*   **5.5.2. Quản lý Phiên bản Cơ sở hạ tầng (Infrastructure as Code):** Trình bày việc sử dụng công cụ **Flyway** để quản lý các tập lệnh DDL và DML (Seed Data), loại bỏ thao tác thủ công.
*   **5.5.3. Chiến lược Chỉ mục và Toàn vẹn Tham chiếu (Indexing & Referential Integrity):** Trình bày các chỉ mục B-Tree đã thiết lập và hành vi của khóa ngoại (`ON DELETE CASCADE`, `RESTRICT`) theo chuẩn hóa 3NF (E.F. Codd).

#### 5.6. Cơ chế Bảo mật và Xử lý Ngoại lệ Toàn trình (End-to-End Security & Exception Handling)
*Hướng dẫn biên soạn: Làm rõ cách hai hệ thống phối hợp bảo vệ dữ liệu.*

*   **5.6.1. Bảo mật Phi trạng thái (Stateless Authentication):** Trình bày luồng cấp phát, ký số (HS256) và giải mã JSON Web Token (JWT) theo tiêu chuẩn RFC 7519.
*   **5.6.2. Kiểm soát Truy cập Dựa trên Cấp độ Phương thức (Method-Level Security):** Trình bày việc sử dụng `@PreAuthorize` tại Backend để đánh chặn các nỗ lực Vượt quyền Ngang/Dọc (BOLA).
*   **5.6.3. Chuẩn hóa Khế ước Lỗi (Error Contract Standardization):** Trình bày lớp `GlobalExceptionHandler` tại Backend biên dịch mọi ngoại lệ thành cấu trúc JSON chuẩn **RFC 7807 (Problem Details)**, giúp Frontend trích xuất thông điệp và hiển thị Toast Notification một cách nhất quán (Zero Silent Failures).

---

###CẤU TRÚC MỤC LỤC CHI TIẾT (DETAILED TABLE OF CONTENTS STRUCTURE)

Dưới đây là khung sườn chuẩn mực học thuật bắt buộc phải trình bày trong đồ án đối với Chương 6.

#### 6.1. Phương pháp luận và Môi trường Kiểm thử (Testing Methodology & Environment)
*Hướng dẫn biên soạn: Khẳng định cơ sở lý luận của toàn bộ quá trình kiểm thử.*

*   **6.1.1. Mô hình và Chiến lược Kiểm thử (Testing Strategy):** Biện luận việc áp dụng Mô hình Chữ V (V-Model) để đảm bảo mọi pha phát triển đều có pha kiểm thử đối ứng. Trình bày chiến lược kiểm thử kết hợp Hộp trắng (White-box) tại Backend và Hộp đen (Black-box) tại Frontend/API.
*   **6.1.2. Môi trường và Công cụ (Environment & Tools):** Liệt kê chi tiết cấu hình phần cứng/phần mềm phục vụ kiểm thử. Đặc tả các công cụ: JUnit 5, Mockito (Unit Test Backend); Postman (API Contract Test); React Developer Tools, Zustand DevTools (State Validation); H2 In-memory Database.

#### 6.2. Kiểm thử Đơn vị và Phân tích Độ bao phủ (Unit Testing & Code Coverage)
*Hướng dẫn biên soạn: Trình bày các bài kiểm thử cô lập, tập trung vào logic cốt lõi. Bắt buộc có ảnh chụp báo cáo đo lường.*

*   **6.2.1. Kiểm thử Tầng Dịch vụ (Backend Service Layer Testing):** 
    *   *Nội dung:* Trình bày việc sử dụng Mockito để giả lập (Mock) Tầng Truy xuất dữ liệu (Repository). 
    *   *Điểm nhấn:* Trình bày kịch bản kiểm thử thuật toán Máy trạng thái (State Machine) của Đề tài theo Thiết kế Hướng Miền (DDD), xác minh hệ thống ném ngoại lệ `IllegalStateException` khi cố tình chuyển trạng thái sai quy trình.
*   **6.2.2. Đánh giá Độ bao phủ Mã (Code Coverage Evaluation):** 
    *   *Nội dung:* Cung cấp báo cáo trích xuất từ công cụ JaCoCo. Biện luận tỷ lệ bao phủ Lệnh (Instruction Coverage) và Nhánh (Branch Coverage) đạt tiêu chuẩn công nghiệp (tối thiểu 80% cho Tầng Dịch vụ).

#### 6.3. Kiểm thử Tích hợp và Xử lý Giao dịch (Integration & Transactional Testing)
*Hướng dẫn biên soạn: Trình bày sự tương tác giữa các thành phần và cơ sở dữ liệu.*

*   **6.3.1. Kiểm thử Toàn vẹn Tham chiếu Cơ sở dữ liệu (Referential Integrity Testing):** Trình bày các kịch bản kiểm thử hành vi `ON DELETE CASCADE` và `RESTRICT` trực tiếp trên MySQL. Xác minh dữ liệu không bị mồ côi (Orphaned Data).
*   **6.3.2. Kiểm thử Nguyên tử tính của Giao dịch (Transaction Atomicity Testing):** Trình bày kịch bản sử dụng `@SpringBootTest` kết hợp H2 Database. Giả lập một ngoại lệ thời gian chạy (RuntimeException) trong quá trình ghi Lịch sử Kiểm toán (AuditLog) để chứng minh cơ chế Hoàn tác Giao dịch (Transaction Rollback) của Spring `@Transactional` hoạt động chính xác.

#### 6.4. Kiểm thử Giao diện Lập trình Ứng dụng và Khế ước Dữ liệu (API Contract & RESTful Testing)
*Hướng dẫn biên soạn: Trình bày việc kiểm định ranh giới mạng, sử dụng Postman làm minh chứng.*

*   **6.4.1. Xác minh Định tuyến và Ngữ nghĩa RESTful (Routing & Semantic Validation):** Trình bày việc sử dụng đúng các động từ HTTP (GET, POST, PUT, PATCH, DELETE) và mã trạng thái phản hồi (200, 201, 204).
*   **6.4.2. Kiểm thử Tính bền bỉ của Dữ liệu Đầu vào (Payload Validation Testing):** Trình bày các kịch bản cố tình gửi JSON sai định dạng, thiếu trường bắt buộc, hoặc vi phạm biên (Boundary Value Analysis). Xác minh Tầng Trình diễn (Controller) thông qua JSR-380 (Hibernate Validator) đánh chặn thành công và trả về mã HTTP 400 Bad Request kèm cấu trúc lỗi chuẩn RFC 7807.

#### 6.5. Kiểm thử Phi chức năng: Bảo mật và Hiệu suất (Non-Functional Testing: Security & Performance)
*Hướng dẫn biên soạn: Yếu tố quyết định phân biệt một ứng dụng học thuật với một ứng dụng cấp doanh nghiệp.*

*   **6.5.1. Kiểm thử Bảo mật Phi trạng thái (Stateless Security Testing):**
    *   Trình bày kịch bản giả mạo chuỗi JSON Web Token (JWT Signature Forgery).
    *   Trình bày kịch bản kiểm thử Hết hạn Phiên (Token Expiration). Xác minh Frontend (Axios Interceptor) tự động bắt mã HTTP 401 và điều hướng về trang Đăng nhập.
*   **6.5.2. Kiểm thử Kháng Leo thang Đặc quyền (Privilege Escalation Defense):** Trình bày kịch bản tác nhân Chủ nhiệm Đề tài (RESEARCHER) cố tình gọi API Lập Biên bản của Thư ký (SECRETARY). Xác minh hệ thống (cả Frontend PrivateRoute và Backend `@PreAuthorize`) chặn đứng và trả về HTTP 403 Forbidden (Tuân thủ OWASP API Security).

#### 6.6. Kiểm thử Chấp nhận của Người dùng toàn trình (End-to-End User Acceptance Testing - UAT)
*Hướng dẫn biên soạn: Trình bày các kịch bản theo luồng nghiệp vụ thực tế trên giao diện ReactJS. Đây là phần có khối lượng hình ảnh minh họa lớn nhất.*

*   **6.6.1. Thiết kế Ma trận Kịch bản UAT (UAT Scenario Matrix):** Cung cấp bảng liệt kê các luồng nghiệp vụ sinh mệnh (Happy Paths).
*   **6.6.2. Kịch bản 1: Khởi tạo và Đệ trình Hồ sơ Khoa học:** Trình bày chi tiết thao tác của Giảng viên trên Biểu mẫu Đa bước (Wizard Form), xử lý tải tệp và sự phản hồi của Giao diện (Toast Notification).
*   **6.6.3. Kịch bản 2: Sơ duyệt và Phân quyền Khoa học:** Trình bày thao tác của Phụ trách Khoa. Trọng tâm vào việc xác minh tính Cách ly Dữ liệu (Data Isolation) – Khoa nào chỉ thấy đề tài của Khoa đó.
*   **6.6.4. Kịch bản 3: Thẩm định Học thuật và Toán học Giao diện:** Trình bày thao tác của Chuyên gia trên Ma trận đánh giá (Split-pane PDF). Xác minh thuật toán tính tổng điểm phản ứng (Reactive) trên ReactJS hoạt động chính xác.
*   **6.6.5. Kịch bản 4: Cổng Sẵn sàng và Quyết định Pháp lý:** Trình bày thao tác của Thư ký. Xác minh cơ chế khóa/mở nút Lập Biên bản dựa trên tiến độ nộp phiếu của các chuyên gia khác.

#### 6.7. Đánh giá Chất lượng và Mức độ Hoàn thiện Hệ thống (Quality Evaluation & System Completeness)
*Hướng dẫn biên soạn: Tổng kết lại toàn bộ chương bằng các số liệu định lượng và định tính.*

*   **6.7.1. Ma trận Truy xuất Yêu cầu (Requirements Traceability Matrix - RTM):** Cung cấp một bảng đối chiếu chứng minh 100% các Yêu cầu Chức năng (Functional Requirements) đã định nghĩa ở Chương 3/4 đều có ít nhất một Test Case tương ứng đạt kết quả PASS.
*   **6.7.2. Đánh giá Mức độ Đáp ứng Kiến trúc (Architectural Compliance Assessment):** Khẳng định sự thành công trong việc áp dụng Kiến trúc Phân tách (Decoupled Architecture), giao tiếp qua REST API và khả năng bảo mật toàn vẹn.
*   **6.7.3. Các Hạn chế Hiện tại và Hướng Phát triển (Current Limitations & Future Works):** Trình bày trung thực các tính năng chưa hoàn thiện (nếu có) hoặc các giải pháp có thể tối ưu hơn trong tương lai (Ví dụ: Tích hợp Redis Cache, Triển khai Docker/Kubernetes).

---

### 3. KẾT LUẬN VÀ KHUYẾN NGHỊ VĂN PHONG BIÊN SOẠN

Cấu trúc Chương 6 nêu trên được thiết kế để tạo ra sự cộng hưởng chặt chẽ với Chương 5 (Triển khai và Thiết kế). Bất kỳ một quyết định kiến trúc nào được tự hào trình bày ở Chương 5 đều phải được mang ra kiểm chứng bằng dữ liệu và kịch bản thực tế tại Chương 6.
**Khuyến nghị thực thi dành cho người viết báo cáo:**

1. **Tính trực quan:** Tại mỗi tiểu mục của phần 5.3 (Frontend), bắt buộc phải chèn 01 Đoạn mã nguồn trọng tâm (Code Snippet - Snippet chỉ giữ lại logic cốt lõi, loại bỏ mã HTML/CSS rườm rà) và 01 Ảnh chụp màn hình giao diện (Screenshot) tương ứng đã được kết xuất thành công.

2. **Từ chối sự mô tả bề mặt:** Tránh viết các câu như "Em dùng Axios để gọi API". Phải chuyển đổi thành văn phong học thuật: "Hệ thống áp dụng Mẫu thiết kế Singleton để khởi tạo một thể hiện Axios trung tâm, tích hợp Bộ đánh chặn (Interceptor) nhằm tự động hóa việc đính kèm mã thông báo bảo mật vào tiêu đề HTTP, tuân thủ nguyên lý giao tiếp phi trạng thái".

3. **Sự gắn kết:** Luôn chỉ ra mối liên hệ nhân quả. Ví dụ, khi trình bày việc Frontend bắt lỗi 400 bằng Axios, phải liên kết (cross-reference) ngay đến việc Backend sử dụng JSR-380 (Hibernate Validator) ở mục 5.6.3 để tạo ra lỗi đó.

**Khuyến nghị thực thi dành cho người viết báo cáo:**

1.  **Tính Khách quan (Objectivity):** Tuyệt đối không sử dụng các từ ngữ mang tính cảm tính như *"Hệ thống chạy rất nhanh"*, *"Giao diện rất đẹp"*. Phải thay thế bằng ngôn ngữ định lượng: *"Thời gian phản hồi (TTFB) của API truy xuất danh sách dưới 200ms"*, *"Giao diện phản hồi thông báo ngoại lệ chuẩn xác trong 100% các trường hợp nhập sai dữ liệu"*.

2.  **Sử dụng Hình ảnh Đặc tả (Annotated Evidence):** Khi dán ảnh chụp màn hình (Postman, ReactJS UI, Terminal Log), bắt buộc phải có khung đỏ đánh dấu vào điểm trọng tâm cần chứng minh (Ví dụ: Đánh dấu vào mã `403 Forbidden` trên Postman để chứng minh phân quyền thành công).

3.  **Biện luận Lỗi (Error Justification):** Kiểm thử không chỉ là chứng minh hệ thống làm đúng. Việc trình bày các kịch bản cố tình làm sai (Negative Testing) và chỉ ra cách hệ thống bắt lỗi một cách thanh lịch (Graceful Degradation) chính là điểm cộng học thuật lớn nhất, chứng tỏ tư duy của một Kỹ sư Đảm bảo Chất lượng chuyên nghiệp.