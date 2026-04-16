### 1. TỔNG QUAN PHƯƠNG PHÁP LUẬN BIÊN SOẠN BÁO CÁO

Báo cáo này đệ trình một cấu trúc khung (Framework) mang tính học thuật cao, phục vụ cho việc biên soạn tài liệu đồ án tổng kết và thiết kế kịch bản thuyết trình (Presentation Script) trước Hội đồng chuyên môn. 

Cấu trúc được thiết kế dựa trên tiêu chuẩn **IEEE 1016-2009 (Software Design Descriptions)**. Trọng tâm của tài liệu đặt tại **Chương 5: Triển khai Hệ thống**, nơi mọi luồng nghiệp vụ (Workflow) đã được tái cấu trúc sẽ được diễn giải tường minh, đi từ bề mặt Tầng Trình diễn (ReactJS) xuyên qua Tầng Giao diện Lập trình (RESTful API), đến Tầng Dịch vụ (Spring Boot) và kết thúc tại Tầng Lưu trữ Vật lý (MySQL). Mọi hành vi của hệ thống đều được biện luận dựa trên nguyên lý Thiết kế Hướng Miền (Domain-Driven Design - DDD) và Máy trạng thái Hữu hạn (Finite State Machine - FSM).
---

### 2. CẤU TRÚC MỤC LỤC BÁO CÁO VÀ KỊCH BẢN THUYẾT TRÌNH

Dưới đây là cấu trúc phân rã chi tiết các chương mục cần trình bày, tập trung giải phẫu sự ưu việt của hệ thống sau quá trình khắc phục khiếm khuyết.

#### CHƯƠNG 1 & 2: TỔNG QUAN VÀ CƠ SỞ LÝ THUYẾT (10% Thời lượng)
*   **Mục tiêu:** Khẳng định nền tảng kỹ thuật và kiến trúc hệ thống.
*   **1.1. Đặt vấn đề và Phạm vi dự án:** Nêu rõ tính cấp thiết của việc số hóa quy trình xét duyệt đề tài khoa học.
*   **2.1. Kiến trúc Phân tách Khách - Chủ (Decoupled Client-Server):** Trình bày việc áp dụng nguyên lý REST của Roy Fielding, đảm bảo tính phi trạng thái (Statelessness).
*   **2.2. Lựa chọn Công nghệ:** Biện luận việc sử dụng ReactJS cho Tầng Trình diễn (tối ưu hóa DOM ảo), Spring Boot cho Tầng Dịch vụ (quản lý giao dịch ACID) và MySQL cho Tầng Lưu trữ (đảm bảo toàn vẹn quan hệ).

#### CHƯƠNG 3 & 4: PHÂN TÍCH NGHIỆP VỤ VÀ THIẾT KẾ CƠ SỞ DỮ LIỆU (15% Thời lượng)
*   **Mục tiêu:** Trình bày sự tương thích giữa nghiệp vụ và cấu trúc dữ liệu.
*   **3.1. Đặc tả Yêu cầu theo IEEE 29148:** Liệt kê các tác nhân (Actors) và ma trận phân quyền (RBAC/ABAC).
*   **4.1. Chuẩn hóa Cơ sở dữ liệu (Database Normalization):**
    *   *Điểm nhấn thuyết trình:* Trình bày cách hệ thống giải quyết vi phạm Dạng chuẩn 1 (1NF) đối với danh sách thành viên tham gia đề tài bằng cách thiết lập Thực thể Kết hợp (Associative Entity) `topic_members`. Biện luận việc sử dụng `ON DELETE CASCADE` để bảo vệ tính toàn vẹn tham chiếu.

#### CHƯƠNG 5: TRIỂN KHAI VÀ HIỆN THỰC HÓA HỆ THỐNG (60% Thời lượng - TRỌNG TÂM)
*Mục tiêu: Trình diễn luồng hoạt động thực tế, đối khớp trực tiếp với 4 quy trình nghiệp vụ lõi và phân hệ bảo mật.*

**5.1. Phân hệ Quản trị Danh tính và An toàn Thông tin (IAM & Security)**
*   **Mô tả kịch bản:** Trình diễn khả năng phòng thủ của hệ thống trước các dị thường dữ liệu đầu vào.
*   **Tính năng 1: Cơ chế Chống Tấn công Vét cạn (Brute-force Protection).** Trình diễn việc nhập sai mật khẩu liên tục. Khẳng định hệ thống bảo toàn dữ liệu Email trên biểu mẫu (chỉ xóa trường Password để tối ưu UX), đồng thời kích hoạt logic khóa tài khoản ở Tầng Dịch vụ, từ chối xác thực trong khoảng thời gian quy định (HTTP 423 Locked).
*   **Tính năng 2: Tiêu chuẩn Hóa Mật mã và Tính Truy vết.** Trình diễn tính năng Đổi mật khẩu. Trình bày việc Tầng Máy khách (Yup Schema) và Tầng Máy chủ (JSR-380) đồng bộ đánh giá cường độ mật khẩu (chữ hoa, chữ thường, ký tự đặc biệt). Sau khi đổi thành công, hệ thống tự động ghi nhận một bản ghi vào Lịch sử Thông báo nội bộ để đảm bảo tính không thể chối bỏ (Non-repudiation).

**5.2. Hiện thực hóa Quy trình 1: Khởi tạo và Sơ duyệt Cấp cơ sở**
*   **Hành vi Chủ nhiệm (Researcher):** Trình diễn biểu mẫu đa bước (Wizard). Nhấn mạnh việc Chủ nhiệm có thể phân bổ danh sách thành viên tham gia một cách linh hoạt dựa trên cấu trúc CSDL đã chuẩn hóa ở Chương 4.
*   **Hành vi Phụ trách Khoa (Dept Head):** Trình diễn không gian làm việc chia đôi (Split-pane). 
    *   *Điểm nhấn:* Hệ thống áp dụng nguyên lý Cách ly Dữ liệu (Data Isolation), Phụ trách Khoa chỉ thấy đề tài của đơn vị mình. Khi nhấn "Từ chối", hệ thống bắt buộc nhập lý do và luân chuyển trạng thái về `REVISION_REQUIRED`. Khi "Đồng ý", hệ thống chuyển hồ sơ sang `DEPT_APPROVED`.

**5.3. Hiện thực hóa Quy trình 2: Kiểm tra Thủ tục và Thành lập Hội đồng**
*   **Hành vi Nhân viên QLKH (Manager):** Trình diễn màn hình kế thừa dữ liệu. Quản lý QLKH xem được đề tài cùng toàn bộ Lịch sử Nhận xét từ cấp Khoa.
*   **Cơ chế Phản hồi Dải rộng (Broadcast Feedback):** Trình diễn tính năng gửi Feedback khi thiếu thủ tục. Hệ thống tự động tạo Thông báo (Notification) đồng thời cho cả Chủ nhiệm và Phụ trách Khoa.
*   **Tự động hóa Khởi tạo và Điều phối (Automation & Orchestration):** Trình diễn tính năng Lập Hội đồng. Manager gán 5 chuyên gia với 5 vai trò riêng biệt.
    *   *Điểm nhấn:* Hệ thống thực thi một Giao dịch Phức hợp (Complex Transaction) tại Tầng Dịch vụ: Tự động khởi tạo tài khoản cho chuyên gia chưa có trên hệ thống, tự động sinh mật khẩu ngẫu nhiên (chỉ hiển thị một lần), lưu trữ bản băm BCrypt, và kích hoạt luồng bất đồng bộ (Asynchronous Thread) xuất bản Email thông báo qua giao thức SMTP.

**5.4. Hiện thực hóa Quy trình 3: Thẩm định Học thuật và Điều hành Phiên họp**
*ĐÂY LÀ ĐIỂM NHẤN KIẾN TRÚC PHỨC TẠP NHẤT. Cần trình diễn khả năng định tuyến đa hình (Polymorphic Routing) và Kiểm soát Đồng thời (Concurrency Control).*
*   **Định tuyến Đa hình dựa trên Ngữ cảnh (Context-Aware Routing):** Trình diễn việc một chuyên gia đóng vai trò Chủ tịch ở Đề tài A (hiển thị nút "Vào phòng đánh giá") nhưng đóng vai trò Thư ký ở Đề tài B (hiển thị nút "Quản trị phiên họp"). Tầng Máy khách dựa vào thuộc tính `councilRole` từ API để rẽ nhánh giao diện chính xác.
*   **Chức năng Điều hành của Thư ký (Secretary Orchestration):** 
    *   *Trình diễn:* Thư ký truy cập Màn hình Quản trị Phiên họp. Nút "Bắt đầu Phiên họp" được kích hoạt để mở quyền truy cập Form chấm điểm cho các thành viên. (Hệ thống thay đổi cờ trạng thái của Phiên họp trong CSDL).
    *   *Theo dõi Thời gian thực:* Giao diện Thư ký liên tục thăm dò (Polling) tiến độ thu thập phiếu. Nút "Lập Biên Bản" bị khóa cứng (Disabled) cho đến khi 4 chuyên gia hoàn tất.
*   **Thuộc tính Bất biến của Phiếu đánh giá (Evaluation Immutability):** 
    *   *Trình diễn:* Chuyên gia (Reviewer) nhập điểm, hệ thống tính tổng tự động (Reactive Math) và đệ trình. Sau khi đệ trình, chuyên gia tải lại trang (F5).
    *   *Điểm nhấn:* Hệ thống truy xuất dữ liệu cũ, đổ lên giao diện và chuyển toàn bộ Form sang trạng thái Chỉ đọc (Read-only). Tầng Dịch vụ từ chối mọi yêu cầu `POST/PUT` tiếp theo nhằm bảo vệ tính toàn vẹn của kết quả đánh giá.
*   **Lập Biên bản và Quản lý Đa đề tài:** Trình diễn việc Thư ký nhận kết quả Điểm trung bình từ Backend, điền Biên bản và chọn Kết luận. Vì một hội đồng chấm nhiều đề tài, sau khi đệ trình biên bản cho Đề tài A, hệ thống cho phép Thư ký quay lại Dashboard và thao tác tương tự cho Đề tài B.

**5.5. Hiện thực hóa Quy trình 4: Vòng lặp Hoàn thiện Hậu Xét duyệt**
*   **Khả năng Truy vết (Traceability):** Chủ nhiệm truy cập Đề tài. Màn hình Lịch sử (Timeline) hiển thị toàn bộ dấu vết từ Khoa, Phòng QLKH đến Biên bản Hội đồng.
*   **Thuật toán Quay vòng Trạng thái (Cyclic State Routing):** 
    *   *Trình diễn:* Dựa trên quyết định của Biên bản (Sửa nhỏ vs Sửa lớn), khi Chủ nhiệm nộp lại hồ sơ, Tầng Dịch vụ phân giải trạng thái.
    *   Nếu Sửa nhỏ: Chuyển trạng thái sang `APPROVED` (Hoàn tất).
    *   Nếu Sửa lớn: Máy trạng thái bẻ ghi, đưa hồ sơ luân chuyển ngược lại `PENDING_COUNCIL` (Vào lại phòng chấm điểm của Hội đồng cũ). Thuật toán đảm bảo tính khép kín của vòng đời phần mềm.

#### CHƯƠNG 6: KIỂM THỬ VÀ ĐẢM BẢO CHẤT LƯỢNG (10% Thời lượng)
*   **Mục tiêu:** Cung cấp bằng chứng học thuật về độ tin cậy của hệ thống.
*   **6.1. Kiểm thử Đơn vị và Tích hợp:** Trình bày việc sử dụng JUnit/Mockito. Cung cấp báo cáo độ bao phủ mã (Code Coverage) đạt tiêu chuẩn, chứng minh các thuật toán tính điểm và luồng rẽ nhánh FSM hoạt động vô trùng.
*   **6.2. Kiểm thử Chấp nhận của Người dùng (UAT):** Khẳng định toàn bộ các quy trình 1, 2, 3, 4 đã vượt qua chu kỳ UAT cuối cùng mà không phát sinh dị thường (Anomalies) ở cấp độ kiến trúc.

#### CHƯƠNG 7: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN TƯƠNG LAI (5% Thời lượng)
*   **7.1. Tổng kết Tự đánh giá:** Hệ thống đã chuyển đổi thành công từ đặc tả văn bản sang một ứng dụng Enterprise nguyên khối (Monolith) bền vững, giải quyết triệt để bài toán số hóa quy trình học thuật phức tạp.
*   **7.2. Hướng phát triển:** Đề xuất tích hợp Chữ ký số (Digital Signature) thay cho hộp kiểm xác nhận pháp lý, và chuyển đổi kiến trúc sang Vi dịch vụ (Microservices) nếu quy mô mở rộng cấp Đại học Quốc gia.

---

### 3. KẾT LUẬN VÀ CHỈ ĐẠO THỰC THI THUYẾT TRÌNH

Bản cấu trúc báo cáo trên là một lộ trình học thuật sắc bén, được thiết kế để dẫn dắt Hội đồng Đánh giá đi từ sự thấu hiểu vấn đề đến sự thán phục trước các giải pháp kiến trúc sâu sắc.

**Khuyến nghị khi Thuyết trình (Demo):**
1.  **Sử dụng Đa Trình duyệt (Multi-browser Demo):** Trong quá trình demo Quy trình 3 (Hội đồng), hãy mở sẵn 3 trình duyệt (Chrome, Edge, Firefox) đăng nhập sẵn các vai trò Thư ký, Chủ tịch và Ủy viên. Việc thể hiện sự tương tác thời gian thực (Thành viên nộp phiếu -> Màn hình Thư ký cập nhật ngay lập tức) sẽ là điểm sáng biểu diễn năng lực tích hợp hệ thống.
2.  **Mở DevTools:** Khi biểu diễn tính năng Khóa Form (Read-only) sau khi nộp, hãy mở F12 (Network tab) để chứng minh rằng ngay cả khi cố tình dùng công cụ chỉnh sửa mã HTML để bấm nút nộp, Tầng Backend vẫn ném lỗi HTTP 409 Conflict, khẳng định hệ thống an toàn từ trong lõi.

Cấu trúc này đảm bảo báo cáo đồ án của nhóm đạt tiêu chuẩn của một dự án Kỹ nghệ Phần mềm xuất sắc.