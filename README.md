🎓 HUST Student Management System (Hệ thống Quản lý Đào tạo)
Dự án phát triển hệ thống quản lý điểm số và đào tạo theo tín chỉ mô phỏng quy trình của Đại học Bách Khoa Hà Nội (HUST). Hệ thống tập trung vào việc phân quyền chặt chẽ, nhập liệu nhanh và cơ chế phúc khảo điểm số hai chiều.

🚀 Tính năng nổi bật
1. 👮 Quản trị viên (Admin)
Quản lý tập trung: Toàn quyền tạo và xóa tài khoản Giảng viên, Sinh viên.
Nhập liệu hàng loạt (Excel-like): Giao diện nhập liệu dạng bảng cho phép thêm nhiều tài khoản cùng lúc thay vì nhập từng form lẻ tẻ.
Phân công giảng dạy: Tạo lớp học phần và gán trực tiếp cho Giảng viên phụ trách.

2. 👨‍🏫 Giảng viên (Lecturer)
Quản lý lớp học: Chỉ nhìn thấy các lớp học phần được Admin phân công.
Nhập điểm chi tiết: Nhập điểm Quá trình (QT) và Cuối kỳ (CK). Hệ thống tự động tính điểm Tổng kết (Hệ 10) và quy đổi điểm Chữ (A, B, C...).
Hộp thư Phúc khảo: Nhận tin nhắn thắc mắc từ sinh viên, có thể phản hồi trực tiếp hoặc xóa tin nhắn.

3. 👨‍🎓 Sinh viên (Student)
Tra cứu điểm: Xem bảng điểm chi tiết (QT, CK, Tổng, Điểm chữ) kèm tên Giảng viên phụ trách.
Gửi Phúc khảo: Gửi tin nhắn thắc mắc tới Giảng viên.
Chống Spam: Hệ thống tích hợp bộ đếm thời gian, giới hạn sinh viên chỉ được gửi 1 tin nhắn mỗi 24 giờ cho một môn học.
Xem phản hồi: Nhận phản hồi từ Giảng viên ngay trên bảng điểm.
🛠️ Công nghệ sử dụng
Frontend: HTML5, CSS3, JavaScript (Vanilla ES6+).
Backend / Database: Google Firebase Realtime Database (NoSQL).
Mô hình: Client-Server trực tiếp (Serverless).


📖 Hướng dẫn Sử dụng (Luồng đi)
1. Đăng nhập Admin
Tài khoản: kdtapcode
Mật khẩu: 123456
Tác vụ: Vào tab DS Giảng viên và DS Sinh viên để nhập dữ liệu. Sau đó sang tab Phân công Lớp để tạo lớp học.
2. Đăng nhập Giảng viên
Sử dụng tài khoản vừa được Admin tạo.
Chọn lớp học -> Nhập điểm cho sinh viên -> Bấm "Lưu".
Kiểm tra hộp thư bên phải để trả lời sinh viên.
3. Đăng nhập Sinh viên
Sử dụng tài khoản vừa được Admin tạo.
Xem điểm số các môn đã học.
Nếu điểm sai, nhập nội dung vào ô "Yêu cầu phúc khảo" và bấm gửi.
📂 Cấu trúc thư mục
HUST-Manage/
├── index.html      # Giao diện chính (Single Page Application)
├── style.css       # Định dạng giao diện (Responsive & Table styles)
├── script.js       # Logic xử lý (Auth, Database, CRUD, Rate Limit)
├── hust-logo.png   # Logo hiển thị
└── README.md       # Tài liệu hướng dẫn
⚠️ Lưu ý quan trọng
Dữ liệu nhập vào bảng Admin cần bấm nút "Lưu toàn bộ danh sách" để đồng bộ lên Firebase.
Nếu xóa một Giảng viên/Sinh viên, dữ liệu điểm số cũ liên quan vẫn có thể tồn tại trong lịch sử (cần xóa thủ công nếu muốn sạch hoàn toàn).
Chức năng gửi tin nhắn phúc khảo tính toán dựa trên thời gian thực của máy tính người dùng (Date.now()).
