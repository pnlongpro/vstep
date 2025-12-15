# Tài liệu Phân tích Module Quản lý Lớp học - VSTEPRO

**Phiên bản:** 1.0  
**Ngày tạo:** 11/12/2024  
**Nền tảng:** VSTEPRO - Hệ thống luyện thi VSTEP

---

## Mục lục

1. [Tổng quan chức năng "Quản lý lớp học"](#1-tổng-quan-chức-năng-quản-lý-lớp-học)
2. [Phân tích màn hình](#2-phân-tích-màn-hình)
3. [Phân tích nghiệp vụ](#3-phân-tích-nghiệp-vụ)
4. [User Flow](#4-user-flow)
5. [Đề xuất Database](#5-đề-xuất-database)
6. [Gợi ý API Endpoints](#6-gợi-ý-api-endpoints)
7. [Tổng kết và đề xuất](#7-tổng-kết-và-đề-xuất)

---

## 1. Tổng quan chức năng "Quản lý lớp học"

### 1.1. Mục tiêu của module

Module **Quản lý lớp học** là trung tâm tổ chức và điều phối hoạt động giảng dạy - học tập trên nền tảng VSTEPRO. Module này giúp:

- **Tổ chức cấu trúc học tập:** Phân chia học viên thành các lớp học theo trình độ (A2, B1, B2, C1)
- **Quản lý nguồn lực:** Phân bổ giáo viên, học viên, tài liệu, và lịch học một cách hiệu quả
- **Theo dõi tiến độ:** Giám sát tiến trình học tập của từng lớp, từng học viên
- **Tối ưu hiệu quả:** Hỗ trợ giáo viên và admin quản lý nhiều lớp đồng thời
- **Cá nhân hóa trải nghiệm:** Mỗi lớp có tài liệu, lịch học, và bài tập riêng biệt

### 1.2. Ai sử dụng module này

| Vai trò | Quyền hạn | Mục đích sử dụng |
|---------|-----------|------------------|
| **Admin** | Toàn quyền | Tạo/sửa/xóa lớp, gán giáo viên, gán học viên, quản lý lịch học toàn hệ thống |
| **Giáo viên** | Chỉ đọc + Quản lý lớp được phân công | Xem danh sách học viên, điểm danh, giao bài tập, cập nhật tiến độ |
| **Trợ giảng** (tùy chọn) | Hỗ trợ giáo viên | Điểm danh, upload tài liệu, trả lời câu hỏi học viên |
| **Học viên** | Chỉ xem lớp của mình | Xem lịch học, tài liệu, thông báo từ lớp |

### 1.3. Các giá trị mang lại

#### Cho Admin:
- ✅ Quản lý tập trung tất cả lớp học trong hệ thống
- ✅ Theo dõi hiệu quả giảng dạy của giáo viên
- ✅ Tối ưu hóa tỷ lệ giáo viên/học viên
- ✅ Báo cáo thống kê theo lớp/khóa học

#### Cho Giáo viên:
- ✅ Xem danh sách học viên của các lớp phụ trách
- ✅ Theo dõi tiến độ học tập từng học viên
- ✅ Giao bài tập và tài liệu cho cả lớp
- ✅ Nhắc nhở deadline, điểm danh
- ✅ Ghi chú về điểm mạnh/yếu của học viên

#### Cho Học viên:
- ✅ Biết rõ lịch học, giáo viên phụ trách
- ✅ Truy cập tài liệu lớp học
- ✅ Nhận thông báo từ giáo viên
- ✅ Xem tiến độ so với cả lớp

---

## 2. Phân tích màn hình

### 2.1. Màn hình: Danh sách lớp học (Class List)

#### **Mục đích**
Hiển thị tất cả các lớp học trong hệ thống, cho phép Admin/Giáo viên xem tổng quan và thao tác nhanh.

#### **Các thành phần UI chính**

1. **Header Bar**
   - Tiêu đề: "Quản lý lớp học"
   - Button "Tạo lớp mới" (màu xanh, icon +)
   - Button "Import" (icon Upload)
   - Button "Export" (icon Download)

2. **Filter/Search Bar**
   - Ô tìm kiếm (Search by tên lớp, mã lớp, giáo viên)
   - Dropdown lọc theo:
     - Trình độ: A2 / B1 / B2 / C1 / Tất cả
     - Trạng thái: Đang học / Hoàn thành / Tạm dừng
     - Giáo viên phụ trách
   - Button "Lọc" (icon Filter)
   - Hiển thị số kết quả: "Tìm thấy 24 lớp"

3. **Class Cards / Table View**

   **Chế độ Card View:**
   - Mỗi card hiển thị:
     - **Tên lớp:** "VSTEP B1 - Lớp 01"
     - **Mã lớp:** #B1-001
     - **Trình độ badge:** B1 (màu xanh dương)
     - **Giáo viên:** TS. Nguyễn Minh (avatar + tên)
     - **Số học viên:** 25/30 (biểu đồ mini)
     - **Lịch học:** T2, T4, T6 | 18:00 - 20:00
     - **Tiến độ:** Progress bar 65%
     - **Trạng thái:** Badge "Đang học" (xanh lá) / "Hoàn thành" (xám)
     - **Actions:**
       - Icon "👁 Xem chi tiết"
       - Icon "✏️ Chỉnh sửa"
       - Icon "📊 Thống kê"
       - Icon "⋮ More" (menu dropdown)

   **Chế độ Table View:**
   - Bảng với các cột:
     - STT
     - Mã lớp
     - Tên lớp
     - Trình độ
     - Giáo viên
     - Số học viên (25/30)
     - Lịch học
     - Tiến độ (%)
     - Trạng thái
     - Thao tác

4. **Pagination**
   - Hiển thị: "Hiển thị 1-12 trong 24 lớp"
   - Nút Previous / Next
   - Dropdown số item/page: 12, 24, 48

5. **Quick Stats (Top of page)**
   - Total Classes: 24
   - Active Classes: 18
   - Completed: 6
   - Total Students: 456

#### **Chức năng trên màn hình**

| Chức năng | Mô tả | Quyền |
|-----------|-------|-------|
| **Tạo lớp mới** | Mở modal "Tạo lớp học" | Admin |
| **Tìm kiếm** | Tìm theo tên lớp, mã lớp, giáo viên | Admin, Giáo viên |
| **Lọc** | Lọc theo trình độ, trạng thái, giáo viên | Admin, Giáo viên |
| **Xem chi tiết** | Chuyển sang màn hình "Chi tiết lớp học" | Admin, Giáo viên |
| **Chỉnh sửa** | Mở modal "Chỉnh sửa thông tin lớp" | Admin |
| **Xóa lớp** | Xác nhận xóa (chỉ khi lớp chưa có học viên) | Admin |
| **Export** | Xuất danh sách lớp ra Excel/CSV | Admin |
| **Toggle View** | Chuyển đổi giữa Card View / Table View | Admin, Giáo viên |

#### **Hành vi/Logic liên quan**

- **Khi load trang:**
  - Gọi API lấy danh sách lớp (mặc định lọc "Đang học")
  - Hiển thị 12 lớp đầu tiên
  - Tính toán Quick Stats

- **Khi tìm kiếm:**
  - Debounce 500ms
  - Highlight từ khóa tìm kiếm trong kết quả
  - Hiển thị "Không tìm thấy kết quả" nếu rỗng

- **Khi lọc:**
  - Cho phép lọc đa điều kiện
  - Reset về trang 1
  - Cập nhật URL params

- **Quyền hạn:**
  - **Admin:** Thấy tất cả lớp
  - **Giáo viên:** Chỉ thấy lớp mình phụ trách

#### **Điều hướng**

- **"Tạo lớp mới"** → [Modal: Tạo lớp học](#22-modal-tạo-lớp-học)
- **"Xem chi tiết"** → [Màn hình: Chi tiết lớp học](#23-màn-hình-chi-tiết-lớp-học)
- **"Chỉnh sửa"** → [Modal: Chỉnh sửa lớp học](#24-modal-chỉnh-sửa-lớp-học)
- **"Thống kê"** → [Màn hình: Thống kê lớp học](#25-màn-hình-thống-kê-lớp-học)

---

### 2.2. Modal: Tạo lớp học (Create Class Modal)

#### **Mục đích**
Cho phép Admin tạo lớp học mới với đầy đủ thông tin cơ bản.

#### **Các thành phần UI chính**

**Form Layout (Wizard 3 bước hoặc Single Page)**

**Bước 1: Thông tin cơ bản**
```
┌─────────────────────────────────────┐
│ 📚 Tạo lớp học mới                  │
├─────────────────────────────────────┤
│                                     │
│ Tên lớp học *                       │
│ [VSTEP B1 - Lớp 01               ] │
│                                     │
│ Mã lớp (tự động) *                  │
│ [B1-001                          ] │
│                                     │
│ Trình độ *                          │
│ [ A2 ▾ ]  [ B1 ▾ ]  [ B2 ▾ ]  [ C1 ▾ ] │
│                                     │
│ Khóa học *                          │
│ [Chọn khóa học                   ▾] │
│                                     │
│ Sĩ số tối đa *                      │
│ [30                              ] │
│                                     │
│ Mô tả lớp học                       │
│ [                                 ] │
│ [                                 ] │
│                                     │
│        [Hủy]    [Tiếp theo →]       │
└─────────────────────────────────────┘
```

**Bước 2: Gán giáo viên & Lịch học**
```
┌─────────────────────────────────────┐
│ 👨‍🏫 Gán giáo viên và lịch học        │
├─────────────────────────────────────┤
│                                     │
│ Giáo viên chính *                   │
│ [Tìm giáo viên...              🔍] │
│                                     │
│ Selected: TS. Nguyễn Minh      [x]  │
│                                     │
│ Giáo viên phụ (tùy chọn)            │
│ [+ Thêm giáo viên phụ]              │
│                                     │
│ Lịch học *                          │
│ Ngày trong tuần:                    │
│ [ ] T2  [✓] T3  [ ] T4  [✓] T5      │
│ [ ] T6  [ ] T7  [ ] CN              │
│                                     │
│ Giờ học:                            │
│ Từ: [18:00 ▾]  Đến: [20:00 ▾]     │
│                                     │
│ Ngày bắt đầu: [15/12/2024      📅] │
│ Ngày kết thúc: [15/03/2025     📅] │
│                                     │
│     [← Quay lại]    [Tiếp theo →]   │
└─────────────────────────────────────┘
```

**Bước 3: Xác nhận**
```
┌─────────────────────────────────────┐
│ ✓ Xác nhận thông tin lớp học        │
├─────────────────────────────────────┤
│                                     │
│ Tên lớp: VSTEP B1 - Lớp 01          │
│ Mã lớp: B1-001                      │
│ Trình độ: B1                        │
│ Sĩ số: 0/30                         │
│ Giáo viên: TS. Nguyễn Minh          │
│ Lịch học: T3, T5 | 18:00 - 20:00    │
│ Thời gian: 15/12/2024 - 15/03/2025  │
│                                     │
│ [✓] Gửi email thông báo giáo viên   │
│                                     │
│     [← Quay lại]    [Tạo lớp học]   │
└─────────────────────────────────────┘
```

#### **Chức năng trên màn hình**

| Input | Validation | Bắt buộc |
|-------|------------|----------|
| Tên lớp | Độ dài 5-100 ký tự, không trùng | ✅ |
| Mã lớp | Auto-generate (LEVEL-XXX), unique | ✅ |
| Trình độ | Chọn từ danh sách A2/B1/B2/C1 | ✅ |
| Khóa học | Chọn từ danh sách khóa học có sẵn | ✅ |
| Sĩ số tối đa | Số nguyên dương, 10-100 | ✅ |
| Giáo viên | Chọn từ danh sách giáo viên active | ✅ |
| Lịch học | Ít nhất 1 ngày, giờ hợp lệ | ✅ |
| Ngày bắt đầu | >= Hôm nay | ✅ |
| Ngày kết thúc | > Ngày bắt đầu | ✅ |

#### **Hành vi/Logic liên quan**

1. **Auto-generate Mã lớp:**
   ```
   Format: {LEVEL}-{NUMBER}
   Ví dụ: B1-001, B1-002, B2-001
   ```

2. **Validate lịch học:**
   - Kiểm tra giáo viên có trống lịch không (conflict checking)
   - Highlight conflict nếu giáo viên đã có lớp khác cùng giờ

3. **Tạo lớp thành công:**
   - Hiển thị toast "Tạo lớp thành công!"
   - Đóng modal
   - Refresh danh sách lớp
   - (Optional) Gửi email thông báo giáo viên

4. **Xử lý lỗi:**
   - Hiển thị lỗi validation inline
   - Không cho submit nếu còn lỗi

#### **Điều hướng**

- **"Hủy"** → Đóng modal, quay về [Danh sách lớp học](#21-màn-hình-danh-sách-lớp-học)
- **"Tạo lớp học"** → Tạo xong, quay về [Danh sách lớp học](#21-màn-hình-danh-sách-lớp-học)
- **"Xem chi tiết lớp vừa tạo"** → [Chi tiết lớp học](#23-màn-hình-chi-tiết-lớp-học)

---

### 2.3. Màn hình: Chi tiết lớp học (Class Detail)

#### **Mục đích**
Hiển thị toàn bộ thông tin chi tiết của một lớp học, bao gồm thông tin cơ bản, danh sách học viên, lịch sử hoạt động, tài liệu.

#### **Các thành phần UI chính**

**Layout: Sidebar Tabs**

```
┌────────────────────────────────────────────────────────────┐
│ ← Quay lại          VSTEP B1 - Lớp 01 (B1-001)       [⋯]  │
├────────────┬───────────────────────────────────────────────┤
│            │  📊 Dashboard lớp học                         │
│ ℹ️ Tổng quan│                                               │
│ 👥 Học viên │  ┌─────────┬─────────┬─────────┬─────────┐  │
│ 📅 Lịch học │  │ Học viên│  Tiến độ│Điểm TB  │Buổi học │  │
│ 📚 Tài liệu │  │   25/30 │   65%   │  7.2    │  12/24  │  │
│ 📝 Bài tập  │  └─────────┴─────────┴─────────┴─────────┘  │
│ 📊 Thống kê │                                               │
│ 💬 Thảo luận│  👨‍🏫 Giáo viên phụ trách                       │
│ ⚙️ Cài đặt  │  TS. Nguyễn Minh                              │
│            │  📧 nguyenminh@vstepro.com                    │
│            │  📞 0912 345 678                              │
│            │                                               │
│            │  📅 Lịch học                                  │
│            │  Thứ 3, Thứ 5 | 18:00 - 20:00                │
│            │  Từ 15/12/2024 đến 15/03/2025                 │
│            │                                               │
│            │  📈 Biểu đồ tiến độ học tập                   │
│            │  [Chart: Line chart tiến độ theo tuần]       │
│            │                                               │
└────────────┴───────────────────────────────────────────────┘
```

**Tab 1: Tổng quan (Overview)**
- Thông tin lớp học
- Giáo viên phụ trách
- Lịch học
- Quick stats (số học viên, tiến độ, điểm TB)
- Biểu đồ tổng quan
- Thông báo gần đây

**Tab 2: Học viên (Students)**

```
┌──────────────────────────────────────────────┐
│ Danh sách học viên (25/30)                   │
│ [🔍 Tìm kiếm...]    [+ Thêm học viên]       │
├──────────────────────────────────────────────┤
│ STT │ Họ tên        │ Email      │ Tiến độ   │
├──────────────────────────────────────────────┤
│ 1   │ Nguyễn Văn A  │ abc@...    │ ▓▓▓░ 75%  │
│ 2   │ Trần Thị B    │ def@...    │ ▓▓░░ 60%  │
│ 3   │ Lê Văn C      │ ghi@...    │ ▓▓▓▓ 90%  │
└──────────────────────────────────────────────┘
```

**Actions:**
- Thêm học viên vào lớp (Modal search & select)
- Xóa học viên khỏi lớp (Confirm dialog)
- Xem chi tiết học viên (Popup)
- Export danh sách học viên

**Tab 3: Lịch học (Schedule)**

Calendar view hiển thị:
- Lịch các buổi học
- Giáo viên dạy (nếu có thay đổi)
- Số học viên điểm danh / tổng số
- Trạng thái: Đã diễn ra / Sắp diễn ra / Hủy

**Actions:**
- Thêm buổi học bù
- Hủy buổi học
- Thay đổi giáo viên cho buổi học cụ thể

**Tab 4: Tài liệu (Materials)**

Danh sách tài liệu của lớp:
- Slide bài giảng (PDF, PPT)
- Bài tập
- Video bài giảng
- Tài liệu tham khảo

**Actions:**
- Upload tài liệu mới
- Download tài liệu
- Xóa tài liệu
- Chia sẻ link tài liệu

**Tab 5: Bài tập (Assignments)**

Danh sách bài tập đã giao:
- Tên bài tập
- Deadline
- Số học viên đã nộp / tổng số
- Trạng thái

**Actions:**
- Tạo bài tập mới
- Xem bài nộp
- Chấm điểm
- Gia hạn deadline

**Tab 6: Thống kê (Analytics)**

Biểu đồ và báo cáo:
- Tỉ lệ tham gia buổi học (Attendance rate)
- Điểm trung bình theo thời gian
- Tỉ lệ hoàn thành bài tập
- So sánh với các lớp khác

**Tab 7: Thảo luận (Discussion)**

Forum cho lớp học:
- Giáo viên đăng thông báo
- Học viên đặt câu hỏi
- Thảo luận nhóm

**Tab 8: Cài đặt (Settings)**

Chỉ Admin mới thấy:
- Chỉnh sửa thông tin lớp
- Đóng/Mở lớp
- Xóa lớp (confirm)
- Gán quyền giáo viên phụ

#### **Chức năng trên màn hình**

| Chức năng | Mô tả | Quyền |
|-----------|-------|-------|
| **Xem thông tin** | Xem tất cả thông tin lớp | Admin, Giáo viên, Học viên |
| **Thêm học viên** | Thêm học viên vào lớp | Admin |
| **Xóa học viên** | Xóa học viên khỏi lớp | Admin |
| **Upload tài liệu** | Upload tài liệu mới | Admin, Giáo viên |
| **Tạo bài tập** | Tạo bài tập mới | Admin, Giáo viên |
| **Chỉnh sửa lớp** | Sửa thông tin lớp | Admin |
| **Xóa lớp** | Xóa lớp (khi chưa có học viên) | Admin |

#### **Hành vi/Logic liên quan**

- **Real-time updates:** Cập nhật số học viên, tiến độ real-time
- **Notification:** Thông báo khi có tài liệu mới, bài tập mới
- **Permission check:** Kiểm tra quyền trước khi hiển thị các button action

#### **Điều hướng**

- **"Quay lại"** → [Danh sách lớp học](#21-màn-hình-danh-sách-lớp-học)
- **"Xem chi tiết học viên"** → Màn hình Profile học viên
- **"Chỉnh sửa lớp"** → [Modal: Chỉnh sửa lớp học](#24-modal-chỉnh-sửa-lớp-học)

---

### 2.4. Modal: Chỉnh sửa lớp học (Edit Class Modal)

#### **Mục đích**
Cho phép Admin cập nhật thông tin lớp học đã tạo.

#### **Các thành phần UI chính**

Tương tự [Modal: Tạo lớp học](#22-modal-tạo-lớp-học) nhưng:
- Pre-fill data hiện tại
- Không cho sửa Mã lớp (read-only)
- Highlight các trường đã thay đổi

#### **Chức năng trên màn hình**

| Chức năng | Logic |
|-----------|-------|
| **Cập nhật thông tin cơ bản** | Tên, mô tả, sĩ số |
| **Thay đổi giáo viên** | Kiểm tra conflict lịch |
| **Cập nhật lịch học** | Áp dụng cho các buổi chưa diễn ra |
| **Thay đổi trạng thái** | Đang học / Hoàn thành / Tạm dừng |

#### **Hành vi/Logic liên quan**

- **Conflict warning:** Cảnh báo nếu thay đổi gây conflict
- **Confirmation:** Xác nhận trước khi lưu
- **Audit log:** Lưu lịch sử thay đổi (ai, khi nào, thay đổi gì)

#### **Điều hướng**

- **"Hủy"** → Đóng modal
- **"Lưu thay đổi"** → Cập nhật, đóng modal, refresh [Chi tiết lớp học](#23-màn-hình-chi-tiết-lớp-học)

---

### 2.5. Màn hình: Thống kê lớp học (Class Analytics)

#### **Mục đích**
Cung cấp báo cáo chi tiết về hiệu quả học tập của lớp.

#### **Các thành phần UI chính**

**Dashboard Layout:**

1. **Filter Bar**
   - Chọn khoảng thời gian (7 ngày / 30 ngày / 3 tháng / Tùy chọn)
   - Export PDF / Excel

2. **Key Metrics Cards**
   ```
   ┌──────────────┬──────────────┬──────────────┬──────────────┐
   │ Tỉ lệ tham dự│   Điểm TB    │  Hoàn thành  │ Tương tác    │
   │    85.2%     │     7.4      │     78%      │   320 msg    │
   │   +2.1% ↑    │   +0.3 ↑     │   -5% ↓      │   +15% ↑     │
   └──────────────┴──────────────┴──────────────┴──────────────┘
   ```

3. **Biểu đồ (Charts)**
   - **Line Chart:** Điểm trung bình theo thời gian
   - **Bar Chart:** Tỉ lệ điểm danh theo buổi học
   - **Pie Chart:** Phân bố điểm số học viên
   - **Heatmap:** Thời gian học tập active nhất

4. **Top Performers / Need Attention**
   - Top 5 học viên xuất sắc
   - 5 học viên cần hỗ trợ

5. **Attendance Table**
   - Bảng điểm danh chi tiết từng buổi

#### **Chức năng trên màn hình**

| Chức năng | Mô tả |
|-----------|-------|
| **Filter by time range** | Lọc dữ liệu theo khoảng thời gian |
| **Export report** | Xuất báo cáo PDF/Excel |
| **Drill down** | Click vào biểu đồ để xem chi tiết |
| **Compare classes** | So sánh với lớp khác cùng trình độ |

#### **Điều hướng**

- **"Quay lại"** → [Chi tiết lớp học](#23-màn-hình-chi-tiết-lớp-học)
- **Click học viên** → Xem chi tiết tiến độ học viên

---

### 2.6. Modal: Thêm học viên vào lớp (Add Students to Class)

#### **Mục đích**
Cho phép Admin thêm học viên vào lớp học.

#### **Các thành phần UI chính**

```
┌─────────────────────────────────────┐
│ Thêm học viên vào lớp B1-001        │
├─────────────────────────────────────┤
│                                     │
│ Tìm kiếm học viên:                  │
│ [Nhập tên hoặc email...        🔍] │
│                                     │
│ Kết quả tìm kiếm:                   │
│ ┌───────────────────────────────┐  │
│ │ [✓] Nguyễn Văn A              │  │
│ │     nguyenvana@gmail.com      │  │
│ │     Trình độ: B1              │  │
│ ├───────────────────────────────┤  │
│ │ [ ] Trần Thị B                │  │
│ │     tranthib@gmail.com        │  │
│ │     Trình độ: B1              │  │
│ ├───────────────────────────────┤  │
│ │ [ ] Lê Văn C                  │  │
│ │     levanc@gmail.com          │  │
│ │     Trình độ: A2 (⚠️ Không khớp)│  │
│ └───────────────────────────────┘  │
│                                     │
│ Đã chọn: 1 học viên                 │
│                                     │
│ [✓] Gửi email thông báo học viên    │
│                                     │
│        [Hủy]    [Thêm vào lớp]      │
└─────────────────────────────────────┘
```

#### **Chức năng trên màn hình**

| Chức năng | Logic |
|-----------|-------|
| **Search** | Tìm kiếm học viên theo tên, email |
| **Filter** | Lọc theo trình độ phù hợp |
| **Multi-select** | Chọn nhiều học viên cùng lúc |
| **Validation** | Kiểm tra lớp còn chỗ không |
| **Send notification** | Gửi email thông báo học viên |

#### **Hành vi/Logic liên quan**

- **Trình độ không khớp:** Cảnh báo nhưng vẫn cho thêm
- **Lớp đã đầy:** Không cho thêm, hiển thị lỗi
- **Học viên đã trong lớp:** Disable checkbox

#### **Điều hướng**

- **"Hủy"** → Đóng modal
- **"Thêm vào lớp"** → Thêm xong, refresh [Tab Học viên](#23-màn-hình-chi-tiết-lớp-học)

---

## 3. Phân tích nghiệp vụ

### 3.1. Tạo lớp học (Create Class)

**Mô tả:**  
Admin tạo một lớp học mới với đầy đủ thông tin cần thiết để bắt đầu khóa học.

**Điều kiện tiên quyết:**
- User có quyền Admin
- Có ít nhất 1 giáo viên trong hệ thống
- Có ít nhất 1 khóa học đã tạo

**Input:**
- Tên lớp học (required)
- Mã lớp (auto-generate, unique)
- Trình độ: A2 / B1 / B2 / C1 (required)
- Khóa học liên kết (required)
- Sĩ số tối đa (required, 10-100)
- Giáo viên chính (required)
- Giáo viên phụ (optional)
- Lịch học: Ngày trong tuần + giờ học (required)
- Thời gian: Ngày bắt đầu - Ngày kết thúc (required)
- Mô tả lớp học (optional)

**Validation rules:**
```javascript
{
  className: {
    minLength: 5,
    maxLength: 100,
    unique: true
  },
  classCode: {
    pattern: /^[A-C][1-2]-\d{3}$/,
    unique: true,
    autoGenerate: true
  },
  level: {
    enum: ['A2', 'B1', 'B2', 'C1']
  },
  maxStudents: {
    type: 'integer',
    min: 10,
    max: 100
  },
  startDate: {
    minDate: 'today'
  },
  endDate: {
    minDate: 'startDate + 1 day'
  },
  schedule: {
    minDays: 1,
    timeFormat: 'HH:mm',
    noConflict: true // Check teacher schedule
  }
}
```

**Kết quả:**
- Tạo record mới trong bảng `classes`
- Tạo record trong bảng `class_teachers` (liên kết giáo viên)
- Tạo lịch học trong bảng `schedules` (auto-generate các buổi học)
- Gửi email thông báo giáo viên (optional)
- Trả về class_id

**Thành phần UI liên quan:**
- [Modal: Tạo lớp học](#22-modal-tạo-lớp-học)

**Error handling:**
```javascript
{
  ERR_CLASS_NAME_DUPLICATE: "Tên lớp đã tồn tại",
  ERR_TEACHER_CONFLICT: "Giáo viên đã có lớp khác cùng giờ",
  ERR_INVALID_DATE_RANGE: "Ngày kết thúc phải sau ngày bắt đầu",
  ERR_MAX_STUDENTS_EXCEEDED: "Sĩ số phải từ 10-100 học viên"
}
```

---

### 3.2. Cập nhật thông tin lớp (Update Class)

**Mô tả:**  
Admin chỉnh sửa thông tin của lớp học đã tạo.

**Điều kiện tiên quyết:**
- User có quyền Admin
- Lớp học tồn tại
- Lớp chưa bị xóa (soft delete)

**Input:**
- class_id (required)
- Các trường có thể cập nhật:
  - Tên lớp
  - Sĩ số tối đa
  - Giáo viên (chính, phụ)
  - Lịch học (chỉ áp dụng cho buổi chưa diễn ra)
  - Thời gian kết thúc
  - Mô tả
  - Trạng thái (active / completed / paused)

**Ràng buộc:**
- Không cho sửa: Mã lớp, Trình độ, Ngày bắt đầu
- Không cho giảm sĩ số < số học viên hiện tại
- Thay đổi giáo viên: Kiểm tra conflict
- Thay đổi lịch học: Chỉ áp dụng cho buổi chưa diễn ra

**Kết quả:**
- Cập nhật record trong `classes`
- Cập nhật `class_teachers` nếu thay đổi giáo viên
- Cập nhật `schedules` nếu thay đổi lịch học
- Tạo audit log (ai, khi nào, thay đổi gì)
- Gửi thông báo nếu thay đổi quan trọng

**Thành phần UI liên quan:**
- [Modal: Chỉnh sửa lớp học](#24-modal-chỉnh-sửa-lớp-học)

---

### 3.3. Xóa lớp học (Delete Class)

**Mô tả:**  
Admin xóa lớp học khỏi hệ thống (soft delete).

**Điều kiện tiên quyết:**
- User có quyền Admin
- Lớp chưa có học viên HOẶC đã hoàn thành

**Input:**
- class_id (required)
- Lý do xóa (optional)

**Validation:**
```javascript
if (class.student_count > 0 && class.status !== 'completed') {
  throw new Error('Không thể xóa lớp đang có học viên');
}
```

**Kết quả:**
- Soft delete: Set `deleted_at = NOW()`
- Xóa liên kết trong `class_teachers`
- Xóa liên kết trong `class_students` (nếu có)
- Hủy các buổi học chưa diễn ra
- Gửi thông báo giáo viên
- Tạo audit log

**Thành phần UI liên quan:**
- Button "Xóa lớp" trong [Chi tiết lớp học](#23-màn-hình-chi-tiết-lớp-học)
- Confirm dialog

---

### 3.4. Danh sách lớp học (List Classes)

**Mô tả:**  
Hiển thị danh sách lớp học với filter, search, pagination.

**Điều kiện tiên quyết:**
- User đã đăng nhập

**Input:**
- Filters:
  - level: A2 / B1 / B2 / C1 / All
  - status: active / completed / paused / All
  - teacher_id (optional)
  - search: Tên lớp, mã lớp
- Pagination:
  - page (default: 1)
  - limit (default: 12)
- Sort:
  - field: created_at / name / student_count
  - order: asc / desc

**Permission logic:**
```javascript
if (user.role === 'admin') {
  // Lấy tất cả lớp
  query = `SELECT * FROM classes WHERE deleted_at IS NULL`;
} else if (user.role === 'teacher') {
  // Chỉ lấy lớp giáo viên phụ trách
  query = `
    SELECT c.* FROM classes c
    JOIN class_teachers ct ON c.id = ct.class_id
    WHERE ct.teacher_id = ? AND c.deleted_at IS NULL
  `;
}
```

**Kết quả:**
```javascript
{
  data: [
    {
      id: 1,
      name: "VSTEP B1 - Lớp 01",
      code: "B1-001",
      level: "B1",
      teacher: { id: 5, name: "TS. Nguyễn Minh" },
      student_count: 25,
      max_students: 30,
      progress: 65, // %
      status: "active",
      schedule: "T3, T5 | 18:00-20:00"
    }
  ],
  pagination: {
    total: 24,
    page: 1,
    limit: 12,
    totalPages: 2
  }
}
```

**Thành phần UI liên quan:**
- [Màn hình: Danh sách lớp học](#21-màn-hình-danh-sách-lớp-học)

---

### 3.5. Tìm kiếm / Lọc lớp (Search & Filter)

**Mô tả:**  
Tìm kiếm và lọc danh sách lớp học theo nhiều tiêu chí.

**Input:**
- **Search query:** Tìm theo tên lớp, mã lớp, tên giáo viên
- **Filters:**
  - Trình độ: A2 / B1 / B2 / C1
  - Trạng thái: active / completed / paused
  - Giáo viên: dropdown danh sách giáo viên
  - Thời gian: Đang diễn ra / Sắp bắt đầu / Đã kết thúc

**Logic tìm kiếm:**
```sql
WHERE 
  (name LIKE '%{query}%' OR code LIKE '%{query}%')
  AND level IN ({selected_levels})
  AND status IN ({selected_statuses})
  AND teacher_id IN ({selected_teachers})
  AND deleted_at IS NULL
```

**Kết quả:**
- Danh sách lớp match điều kiện
- Số lượng kết quả
- Highlight từ khóa tìm kiếm

**Thành phần UI liên quan:**
- Filter bar trong [Danh sách lớp học](#21-màn-hình-danh-sách-lớp-học)

---

### 3.6. Gán giáo viên (Assign Teacher)

**Mô tả:**  
Gán giáo viên chính hoặc giáo viên phụ cho lớp học.

**Điều kiện tiên quyết:**
- User có quyền Admin
- Giáo viên tồn tại và active
- Giáo viên chưa có lớp conflict cùng giờ

**Input:**
- class_id (required)
- teacher_id (required)
- role: 'primary' / 'assistant' (required)

**Validation:**
```javascript
// Check conflict schedule
const hasConflict = await checkTeacherScheduleConflict({
  teacher_id,
  class_id,
  schedule: class.schedule
});

if (hasConflict) {
  throw new Error('Giáo viên đã có lớp khác cùng giờ');
}
```

**Kết quả:**
- Insert vào `class_teachers`
- Gửi email thông báo giáo viên
- Tạo notification trong hệ thống

**Thành phần UI liên quan:**
- Dropdown "Giáo viên" trong [Modal: Tạo lớp học](#22-modal-tạo-lớp-học)
- [Modal: Chỉnh sửa lớp học](#24-modal-chỉnh-sửa-lớp-học)

---

### 3.7. Gán học viên (Assign Students)

**Mô tả:**  
Thêm học viên vào lớp học.

**Điều kiện tiên quyết:**
- User có quyền Admin
- Lớp còn chỗ (student_count < max_students)
- Học viên tồn tại và active

**Input:**
- class_id (required)
- student_ids: [id1, id2, ...] (required)
- send_notification: boolean (default: true)

**Validation:**
```javascript
// Check lớp còn chỗ
if (class.student_count + student_ids.length > class.max_students) {
  throw new Error('Lớp đã đầy');
}

// Check học viên chưa trong lớp
const existingStudents = await getClassStudents(class_id);
const duplicates = student_ids.filter(id => 
  existingStudents.includes(id)
);
if (duplicates.length > 0) {
  throw new Error('Một số học viên đã trong lớp');
}
```

**Kết quả:**
- Insert vào `class_students`
- Cập nhật `student_count` trong `classes`
- Gửi email/notification cho học viên
- Tạo audit log

**Thành phần UI liên quan:**
- [Modal: Thêm học viên vào lớp](#26-modal-thêm-học-viên-vào-lớp)

---

### 3.8. Xóa học viên khỏi lớp (Remove Student)

**Mô tả:**  
Xóa học viên khỏi lớp học.

**Điều kiện tiên quyết:**
- User có quyền Admin
- Học viên đang trong lớp

**Input:**
- class_id (required)
- student_id (required)
- reason (optional)

**Kết quả:**
- Delete từ `class_students`
- Cập nhật `student_count` trong `classes`
- Gửi notification cho học viên
- Tạo audit log

**Thành phần UI liên quan:**
- Button "Xóa" trong [Tab Học viên](#23-màn-hình-chi-tiết-lớp-học)

---

### 3.9. Quản lý lịch học (Manage Schedule)

**Mô tả:**  
Xem và quản lý lịch các buổi học của lớp.

**Chức năng:**
1. **Xem lịch:** Hiển thị lịch các buổi học (đã diễn ra / sắp tới)
2. **Thêm buổi học bù:** Admin/Giáo viên thêm buổi bù
3. **Hủy buổi học:** Hủy buổi học với lý do
4. **Thay giáo viên:** Thay giáo viên dạy cho buổi cụ thể

**Input (Thêm buổi bù):**
- class_id (required)
- date (required)
- start_time (required)
- end_time (required)
- teacher_id (optional, default: giáo viên chính)
- note (optional)

**Kết quả:**
- Insert vào `schedules`
- Gửi notification cho lớp
- Cập nhật calendar

**Thành phần UI liên quan:**
- [Tab Lịch học](#23-màn-hình-chi-tiết-lớp-học)

---

### 3.10. Quản lý tài liệu lớp học (Manage Materials)

**Mô tả:**  
Upload, xem, xóa tài liệu dành cho lớp học.

**Chức năng:**
1. **Upload tài liệu:** Admin/Giáo viên upload file
2. **Xem tài liệu:** Học viên xem/download
3. **Xóa tài liệu:** Admin/Giáo viên xóa

**Input (Upload):**
- class_id (required)
- file (required, max 50MB)
- title (required)
- description (optional)
- category: 'slide' / 'assignment' / 'reference' / 'video'

**Validation:**
```javascript
{
  allowedTypes: ['.pdf', '.pptx', '.docx', '.mp4', '.zip'],
  maxSize: 50 * 1024 * 1024, // 50MB
}
```

**Kết quả:**
- Upload file lên cloud storage (S3, GCS)
- Insert vào `class_materials`
- Gửi notification cho lớp

**Thành phần UI liên quan:**
- [Tab Tài liệu](#23-màn-hình-chi-tiết-lớp-học)

---

### 3.11. Các ràng buộc đặc biệt

#### Ràng buộc 1: Conflict Schedule
```javascript
// Không được phép tạo 2 lớp cùng giáo viên, cùng thời gian
function checkScheduleConflict(teacher_id, schedule) {
  const conflicts = await db.query(`
    SELECT c.* FROM classes c
    JOIN class_teachers ct ON c.id = ct.class_id
    WHERE ct.teacher_id = ?
      AND c.status = 'active'
      AND (
        -- Check overlap schedule
        c.schedule_days && ?
        AND c.start_time < ?
        AND c.end_time > ?
      )
  `, [teacher_id, schedule.days, schedule.end_time, schedule.start_time]);
  
  return conflicts.length > 0;
}
```

#### Ràng buộc 2: Max Students
```javascript
// Không cho thêm học viên nếu lớp đã đầy
if (class.student_count >= class.max_students) {
  throw new Error('CLASS_FULL');
}
```

#### Ràng buộc 3: Soft Delete
```javascript
// Không xóa thật, chỉ đánh dấu deleted_at
UPDATE classes 
SET deleted_at = NOW() 
WHERE id = ?;
```

#### Ràng buộc 4: Unique Class Code
```javascript
// Mã lớp không được trùng
// Format: {LEVEL}-{INCREMENT}
// Ví dụ: B1-001, B1-002, B2-001
function generateClassCode(level) {
  const lastClass = await db.query(`
    SELECT code FROM classes 
    WHERE code LIKE ? 
    ORDER BY code DESC 
    LIMIT 1
  `, [`${level}-%`]);
  
  const lastNumber = lastClass ? parseInt(lastClass.code.split('-')[1]) : 0;
  const newNumber = String(lastNumber + 1).padStart(3, '0');
  
  return `${level}-${newNumber}`;
}
```

---

## 4. User Flow

### 4.1. Flow: Tạo lớp học mới

```
┌─────────────┐
│   Admin     │
└──────┬──────┘
       │
       │ 1. Click "Tạo lớp mới"
       ▼
┌────────────────────────────┐
│ Màn hình: Danh sách lớp học│
└──────────┬─────────────────┘
           │
           │ 2. Mở modal "Tạo lớp học"
           ▼
┌────────────────────────────┐
│  Modal: Tạo lớp học        │
│  [Bước 1: Thông tin cơ bản]│
└──────────┬─────────────────┘
           │
           │ 3. Nhập thông tin:
           │    - Tên lớp
           │    - Trình độ
           │    - Khóa học
           │    - Sĩ số
           ▼
           │ 4. Click "Tiếp theo"
           ▼
┌────────────────────────────┐
│  Modal: Tạo lớp học        │
│  [Bước 2: Giáo viên & Lịch]│
└──────────┬─────────────────┘
           │
           │ 5. Chọn:
           │    - Giáo viên
           │    - Lịch học
           │    - Thời gian
           ▼
           │ 6. Click "Tiếp theo"
           ▼
┌────────────────────────────┐
│  Modal: Tạo lớp học        │
│  [Bước 3: Xác nhận]        │
└──────────┬─────────────────┘
           │
           │ 7. Xem lại thông tin
           │ 8. Click "Tạo lớp học"
           ▼
┌────────────────────────────┐
│   API: POST /classes       │
│   - Validate data          │
│   - Check conflict         │
│   - Create class           │
│   - Send notification      │
└──────────┬─────────────────┘
           │
           │ ✅ Tạo thành công
           ▼
┌────────────────────────────┐
│ Toast: "Tạo lớp thành công"│
│ Đóng modal                 │
│ Refresh danh sách lớp      │
└────────────────────────────┘
```

---

### 4.2. Flow: Chỉnh sửa lớp học

```
Admin → Danh sách lớp → Click "Chỉnh sửa" trên card lớp
  → Modal: Chỉnh sửa lớp (pre-filled data)
  → Sửa thông tin cần thiết
  → Click "Lưu thay đổi"
  → API: PUT /classes/:id
    → Validate
    → Check conflicts (nếu sửa giáo viên/lịch)
    → Update database
    → Create audit log
  → Toast: "Cập nhật thành công"
  → Đóng modal
  → Refresh danh sách lớp
```

---

### 4.3. Flow: Quản lý học viên trong lớp

#### **Flow 4.3.1: Thêm học viên vào lớp**

```
Admin → Chi tiết lớp → Tab "Học viên"
  → Click "Thêm học viên"
  → Modal: Thêm học viên
    → Tìm kiếm học viên (search)
    → Chọn học viên (multi-select)
    → Click "Thêm vào lớp"
  → API: POST /classes/:id/students
    → Validate:
      - Lớp còn chỗ?
      - Học viên chưa trong lớp?
    → Insert class_students
    → Update student_count
    → Send notification
  → Toast: "Đã thêm X học viên"
  → Đóng modal
  → Refresh tab Học viên
```

#### **Flow 4.3.2: Xóa học viên khỏi lớp**

```
Admin → Chi tiết lớp → Tab "Học viên"
  → Click icon "Xóa" trên row học viên
  → Confirm dialog: "Xác nhận xóa?"
  → Click "Xác nhận"
  → API: DELETE /classes/:id/students/:student_id
    → Delete from class_students
    → Update student_count
    → Send notification
    → Create audit log
  → Toast: "Đã xóa học viên"
  → Refresh tab Học viên
```

---

### 4.4. Flow: Quản lý giáo viên

```
Admin → Chi tiết lớp → Tab "Cài đặt"
  → Section "Giáo viên phụ trách"
  → Click "Thay đổi giáo viên"
  → Modal: Chọn giáo viên
    → Search giáo viên
    → Check conflict schedule (real-time)
    → Chọn giáo viên
    → Click "Lưu"
  → API: PUT /classes/:id/teacher
    → Validate:
      - Giáo viên tồn tại?
      - Có conflict không?
    → Update class_teachers
    → Send notification (giáo viên cũ + mới)
  → Toast: "Đã cập nhật giáo viên"
  → Refresh Chi tiết lớp
```

---

### 4.5. Flow: Xem chi tiết lớp

```
Admin/Giáo viên → Danh sách lớp
  → Click "Xem chi tiết" hoặc Click vào card lớp
  → API: GET /classes/:id
    → Lấy thông tin lớp
    → Lấy danh sách học viên
    → Lấy lịch học
    → Lấy thống kê
  → Màn hình: Chi tiết lớp học
    → Hiển thị 8 tabs:
      1. Tổng quan
      2. Học viên
      3. Lịch học
      4. Tài liệu
      5. Bài tập
      6. Thống kê
      7. Thảo luận
      8. Cài đặt (chỉ Admin)
  → User có thể:
    - Xem thông tin
    - Thêm/xóa học viên
    - Upload tài liệu
    - Tạo bài tập
    - Xem thống kê
```

---

### 4.6. Flow: Lọc / Tìm kiếm lớp

```
User → Danh sách lớp học
  → Nhập từ khóa vào ô "Tìm kiếm"
    → Debounce 500ms
    → API: GET /classes?search={query}
    → Hiển thị kết quả (highlight từ khóa)
  
  HOẶC
  
  → Click "Lọc"
    → Chọn:
      - Trình độ: B1
      - Trạng thái: Đang học
      - Giáo viên: TS. Nguyễn Minh
    → Click "Áp dụng"
    → API: GET /classes?level=B1&status=active&teacher=5
    → Hiển thị kết quả
    → Update URL params: ?level=B1&status=active&teacher=5
    → Hiển thị "Tìm thấy X lớp"
```

---

## 5. Đề xuất Database

### 5.1. Bảng: `classes`

**Mục đích:** Lưu trữ thông tin lớp học.

| Cột | Kiểu dữ liệu | Mô tả | Ràng buộc |
|-----|-------------|-------|-----------|
| `id` | BIGINT UNSIGNED | ID lớp học | PRIMARY KEY, AUTO_INCREMENT |
| `code` | VARCHAR(20) | Mã lớp (B1-001) | UNIQUE, NOT NULL |
| `name` | VARCHAR(200) | Tên lớp học | NOT NULL |
| `level` | ENUM('A2','B1','B2','C1') | Trình độ | NOT NULL |
| `course_id` | BIGINT UNSIGNED | Khóa học liên kết | FOREIGN KEY → courses(id) |
| `description` | TEXT | Mô tả lớp học | NULL |
| `max_students` | INT UNSIGNED | Sĩ số tối đa | NOT NULL, DEFAULT 30 |
| `student_count` | INT UNSIGNED | Số học viên hiện tại | DEFAULT 0 |
| `schedule_days` | JSON | Ngày học [2,4,6] (T2,T4,T6) | NOT NULL |
| `start_time` | TIME | Giờ bắt đầu | NOT NULL |
| `end_time` | TIME | Giờ kết thúc | NOT NULL |
| `start_date` | DATE | Ngày bắt đầu khóa | NOT NULL |
| `end_date` | DATE | Ngày kết thúc khóa | NOT NULL |
| `status` | ENUM('active','completed','paused') | Trạng thái | DEFAULT 'active' |
| `progress` | DECIMAL(5,2) | Tiến độ % (0-100) | DEFAULT 0 |
| `created_by` | BIGINT UNSIGNED | Admin tạo | FOREIGN KEY → users(id) |
| `created_at` | TIMESTAMP | Ngày tạo | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | Ngày cập nhật | ON UPDATE CURRENT_TIMESTAMP |
| `deleted_at` | TIMESTAMP | Ngày xóa (soft delete) | NULL |

**Indexes:**
```sql
CREATE INDEX idx_code ON classes(code);
CREATE INDEX idx_level ON classes(level);
CREATE INDEX idx_status ON classes(status);
CREATE INDEX idx_deleted_at ON classes(deleted_at);
```

**Quan hệ:**
- `classes.course_id` → `courses.id` (Many-to-One)
- `classes.created_by` → `users.id` (Many-to-One)

---

### 5.2. Bảng: `class_teachers`

**Mục đích:** Liên kết lớp học với giáo viên (quan hệ Many-to-Many).

| Cột | Kiểu dữ liệu | Mô tả | Ràng buộc |
|-----|-------------|-------|-----------|
| `id` | BIGINT UNSIGNED | ID | PRIMARY KEY, AUTO_INCREMENT |
| `class_id` | BIGINT UNSIGNED | ID lớp học | FOREIGN KEY → classes(id) |
| `teacher_id` | BIGINT UNSIGNED | ID giáo viên | FOREIGN KEY → users(id) |
| `role` | ENUM('primary','assistant') | Vai trò | DEFAULT 'primary' |
| `assigned_at` | TIMESTAMP | Ngày gán | DEFAULT CURRENT_TIMESTAMP |
| `assigned_by` | BIGINT UNSIGNED | Admin gán | FOREIGN KEY → users(id) |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_class_teacher ON class_teachers(class_id, teacher_id);
CREATE INDEX idx_teacher ON class_teachers(teacher_id);
```

**Quan hệ:**
- `class_teachers.class_id` → `classes.id`
- `class_teachers.teacher_id` → `users.id`

---

### 5.3. Bảng: `class_students`

**Mục đích:** Liên kết lớp học với học viên (quan hệ Many-to-Many).

| Cột | Kiểu dữ liệu | Mô tả | Ràng buộc |
|-----|-------------|-------|-----------|
| `id` | BIGINT UNSIGNED | ID | PRIMARY KEY, AUTO_INCREMENT |
| `class_id` | BIGINT UNSIGNED | ID lớp học | FOREIGN KEY → classes(id) |
| `student_id` | BIGINT UNSIGNED | ID học viên | FOREIGN KEY → users(id) |
| `enrollment_date` | DATE | Ngày tham gia | DEFAULT CURRENT_DATE |
| `status` | ENUM('active','completed','dropped') | Trạng thái | DEFAULT 'active' |
| `progress` | DECIMAL(5,2) | Tiến độ cá nhân % | DEFAULT 0 |
| `final_score` | DECIMAL(4,2) | Điểm cuối khóa | NULL |
| `added_by` | BIGINT UNSIGNED | Admin thêm | FOREIGN KEY → users(id) |
| `created_at` | TIMESTAMP | Ngày tạo | DEFAULT CURRENT_TIMESTAMP |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_class_student ON class_students(class_id, student_id);
CREATE INDEX idx_student ON class_students(student_id);
CREATE INDEX idx_status ON class_students(status);
```

**Quan hệ:**
- `class_students.class_id` → `classes.id`
- `class_students.student_id` → `users.id`

---

### 5.4. Bảng: `schedules`

**Mục đích:** Lưu trữ lịch các buổi học của lớp.

| Cột | Kiểu dữ liệu | Mô tả | Ràng buộc |
|-----|-------------|-------|-----------|
| `id` | BIGINT UNSIGNED | ID buổi học | PRIMARY KEY, AUTO_INCREMENT |
| `class_id` | BIGINT UNSIGNED | ID lớp học | FOREIGN KEY → classes(id) |
| `teacher_id` | BIGINT UNSIGNED | Giáo viên dạy | FOREIGN KEY → users(id) |
| `date` | DATE | Ngày học | NOT NULL |
| `start_time` | TIME | Giờ bắt đầu | NOT NULL |
| `end_time` | TIME | Giờ kết thúc | NOT NULL |
| `type` | ENUM('regular','makeup','extra') | Loại buổi học | DEFAULT 'regular' |
| `status` | ENUM('scheduled','completed','cancelled') | Trạng thái | DEFAULT 'scheduled' |
| `attendance_count` | INT UNSIGNED | Số học viên có mặt | DEFAULT 0 |
| `note` | TEXT | Ghi chú | NULL |
| `created_at` | TIMESTAMP | Ngày tạo | DEFAULT CURRENT_TIMESTAMP |

**Indexes:**
```sql
CREATE INDEX idx_class ON schedules(class_id);
CREATE INDEX idx_date ON schedules(date);
CREATE INDEX idx_status ON schedules(status);
```

**Quan hệ:**
- `schedules.class_id` → `classes.id`
- `schedules.teacher_id` → `users.id`

---

### 5.5. Bảng: `class_materials`

**Mục đích:** Lưu trữ tài liệu của lớp học.

| Cột | Kiểu dữ liệu | Mô tả | Ràng buộc |
|-----|-------------|-------|-----------|
| `id` | BIGINT UNSIGNED | ID tài liệu | PRIMARY KEY, AUTO_INCREMENT |
| `class_id` | BIGINT UNSIGNED | ID lớp học | FOREIGN KEY → classes(id) |
| `title` | VARCHAR(200) | Tiêu đề tài liệu | NOT NULL |
| `description` | TEXT | Mô tả | NULL |
| `file_url` | VARCHAR(500) | URL file (S3, GCS) | NOT NULL |
| `file_type` | VARCHAR(50) | Loại file (pdf, pptx...) | NOT NULL |
| `file_size` | BIGINT | Kích thước file (bytes) | NOT NULL |
| `category` | ENUM('slide','assignment','reference','video','other') | Danh mục | DEFAULT 'reference' |
| `uploaded_by` | BIGINT UNSIGNED | User upload | FOREIGN KEY → users(id) |
| `download_count` | INT UNSIGNED | Số lượt tải | DEFAULT 0 |
| `created_at` | TIMESTAMP | Ngày upload | DEFAULT CURRENT_TIMESTAMP |
| `deleted_at` | TIMESTAMP | Ngày xóa | NULL |

**Indexes:**
```sql
CREATE INDEX idx_class ON class_materials(class_id);
CREATE INDEX idx_category ON class_materials(category);
```

**Quan hệ:**
- `class_materials.class_id` → `classes.id`
- `class_materials.uploaded_by` → `users.id`

---

### 5.6. Bảng: `class_audit_logs`

**Mục đích:** Lưu lịch sử thay đổi lớp học (audit trail).

| Cột | Kiểu dữ liệu | Mô tả | Ràng buộc |
|-----|-------------|-------|-----------|
| `id` | BIGINT UNSIGNED | ID log | PRIMARY KEY, AUTO_INCREMENT |
| `class_id` | BIGINT UNSIGNED | ID lớp học | FOREIGN KEY → classes(id) |
| `action` | ENUM('created','updated','deleted','student_added','student_removed','teacher_changed') | Hành động | NOT NULL |
| `user_id` | BIGINT UNSIGNED | User thực hiện | FOREIGN KEY → users(id) |
| `old_data` | JSON | Dữ liệu cũ | NULL |
| `new_data` | JSON | Dữ liệu mới | NULL |
| `ip_address` | VARCHAR(45) | IP thực hiện | NULL |
| `created_at` | TIMESTAMP | Thời gian | DEFAULT CURRENT_TIMESTAMP |

**Indexes:**
```sql
CREATE INDEX idx_class ON class_audit_logs(class_id);
CREATE INDEX idx_action ON class_audit_logs(action);
CREATE INDEX idx_created_at ON class_audit_logs(created_at);
```

---

### 5.7. Sơ đồ quan hệ (ERD)

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│   courses   │       │     classes      │       │    users    │
│─────────────│       │──────────────────│       │─────────────│
│ id (PK)     │◄──────│ id (PK)          │       │ id (PK)     │
│ name        │       │ code (UNIQUE)    │       │ name        │
│ level       │       │ name             │       │ email       │
└─────────────┘       │ level            │       │ role        │
                      │ course_id (FK)   │       └─────────────┘
                      │ max_students     │              │
                      │ student_count    │              │
                      │ status           │              │
                      └──────────────────┘              │
                             │ │ │                      │
                   ┌─────────┘ │ └─────────┐            │
                   │           │           │            │
                   ▼           ▼           ▼            │
          ┌────────────┐ ┌──────────┐ ┌─────────────┐  │
          │class_      │ │schedules │ │class_       │  │
          │teachers    │ │          │ │materials    │  │
          │────────────│ │──────────│ │─────────────│  │
          │ class_id   │ │ class_id │ │ class_id    │  │
          │ teacher_id │◄┼──────────┤ │ file_url    │  │
          │ role       │ │ date     │ │ uploaded_by │──┘
          └────────────┘ │ status   │ └─────────────┘
                   │     └──────────┘
                   │
                   ▼
          ┌────────────┐
          │class_      │
          │students    │
          │────────────│
          │ class_id   │
          │ student_id │
          │ progress   │
          └────────────┘
```

---

## 6. Gợi ý API Endpoints

### 6.1. Tạo lớp học

**Endpoint:** `POST /api/v1/classes`

**Request Headers:**
```javascript
{
  "Authorization": "Bearer {admin_token}",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "VSTEP B1 - Lớp 01",
  "level": "B1",
  "course_id": 5,
  "max_students": 30,
  "description": "Lớp B1 buổi tối dành cho người đi làm",
  "teacher_id": 10,
  "assistant_teacher_id": 12,
  "schedule": {
    "days": [2, 4, 6],
    "start_time": "18:00",
    "end_time": "20:00"
  },
  "start_date": "2024-12-15",
  "end_date": "2025-03-15",
  "send_notification": true
}
```

**Response Success (201):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "code": "B1-015",
    "name": "VSTEP B1 - Lớp 01",
    "level": "B1",
    "status": "active",
    "created_at": "2024-12-11T10:30:00Z"
  },
  "message": "Tạo lớp học thành công"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "ERR_TEACHER_CONFLICT",
    "message": "Giáo viên đã có lớp khác cùng giờ",
    "details": {
      "conflict_class": "B2-010",
      "conflict_time": "T2, T4, T6 | 18:00-20:00"
    }
  }
}
```

**Logic xử lý:**
```javascript
async function createClass(data, adminUser) {
  // 1. Validate input
  validateClassData(data);
  
  // 2. Generate class code
  const code = await generateClassCode(data.level);
  
  // 3. Check teacher schedule conflict
  const hasConflict = await checkTeacherScheduleConflict({
    teacher_id: data.teacher_id,
    schedule: data.schedule,
    start_date: data.start_date,
    end_date: data.end_date
  });
  
  if (hasConflict) {
    throw new ConflictError('ERR_TEACHER_CONFLICT');
  }
  
  // 4. Create class
  const classData = {
    code,
    name: data.name,
    level: data.level,
    course_id: data.course_id,
    max_students: data.max_students,
    description: data.description,
    schedule_days: JSON.stringify(data.schedule.days),
    start_time: data.schedule.start_time,
    end_time: data.schedule.end_time,
    start_date: data.start_date,
    end_date: data.end_date,
    status: 'active',
    created_by: adminUser.id
  };
  
  const newClass = await db.classes.create(classData);
  
  // 5. Assign teachers
  await db.class_teachers.insert({
    class_id: newClass.id,
    teacher_id: data.teacher_id,
    role: 'primary',
    assigned_by: adminUser.id
  });
  
  if (data.assistant_teacher_id) {
    await db.class_teachers.insert({
      class_id: newClass.id,
      teacher_id: data.assistant_teacher_id,
      role: 'assistant',
      assigned_by: adminUser.id
    });
  }
  
  // 6. Generate schedules (auto-create all sessions)
  await generateClassSchedules(newClass);
  
  // 7. Send notification
  if (data.send_notification) {
    await sendTeacherNotification(data.teacher_id, newClass);
  }
  
  // 8. Audit log
  await createAuditLog({
    class_id: newClass.id,
    action: 'created',
    user_id: adminUser.id,
    new_data: classData
  });
  
  return newClass;
}
```

---

### 6.2. Cập nhật lớp học

**Endpoint:** `PUT /api/v1/classes/:id`

**Request Body:**
```json
{
  "name": "VSTEP B1 - Lớp 01 (Cập nhật)",
  "max_students": 35,
  "description": "Mô tả mới",
  "status": "active"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "VSTEP B1 - Lớp 01 (Cập nhật)",
    "updated_at": "2024-12-11T11:00:00Z"
  },
  "message": "Cập nhật lớp học thành công"
}
```

**Logic xử lý:**
```javascript
async function updateClass(classId, data, adminUser) {
  // 1. Check class exists
  const existingClass = await db.classes.findById(classId);
  if (!existingClass) {
    throw new NotFoundError('Class not found');
  }
  
  // 2. Validate changes
  if (data.max_students < existingClass.student_count) {
    throw new ValidationError('Không thể giảm sĩ số xuống dưới số học viên hiện tại');
  }
  
  // 3. Update class
  await db.classes.update(classId, data);
  
  // 4. Audit log
  await createAuditLog({
    class_id: classId,
    action: 'updated',
    user_id: adminUser.id,
    old_data: existingClass,
    new_data: data
  });
  
  return await db.classes.findById(classId);
}
```

---

### 6.3. Xóa lớp học (Soft Delete)

**Endpoint:** `DELETE /api/v1/classes/:id`

**Request Body:**
```json
{
  "reason": "Lớp không đủ học viên"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Xóa lớp học thành công"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "ERR_CLASS_HAS_STUDENTS",
    "message": "Không thể xóa lớp đang có học viên"
  }
}
```

**Logic xử lý:**
```javascript
async function deleteClass(classId, adminUser, reason) {
  const classData = await db.classes.findById(classId);
  
  // Check: Không xóa lớp đang có học viên
  if (classData.student_count > 0 && classData.status !== 'completed') {
    throw new ValidationError('ERR_CLASS_HAS_STUDENTS');
  }
  
  // Soft delete
  await db.classes.update(classId, {
    deleted_at: new Date()
  });
  
  // Cancel future schedules
  await db.schedules.update(
    { class_id: classId, status: 'scheduled' },
    { status: 'cancelled' }
  );
  
  // Audit log
  await createAuditLog({
    class_id: classId,
    action: 'deleted',
    user_id: adminUser.id,
    old_data: { reason }
  });
  
  return { success: true };
}
```

---

### 6.4. Lấy danh sách lớp học

**Endpoint:** `GET /api/v1/classes`

**Query Parameters:**
```
?search=B1
&level=B1,B2
&status=active
&teacher_id=10
&page=1
&limit=12
&sort=created_at
&order=desc
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "code": "B1-015",
      "name": "VSTEP B1 - Lớp 01",
      "level": "B1",
      "teacher": {
        "id": 10,
        "name": "TS. Nguyễn Minh",
        "avatar": "https://..."
      },
      "student_count": 25,
      "max_students": 30,
      "progress": 65.5,
      "status": "active",
      "schedule": "T2, T4, T6 | 18:00-20:00"
    }
  ],
  "pagination": {
    "total": 48,
    "page": 1,
    "limit": 12,
    "totalPages": 4
  }
}
```

**Logic xử lý:**
```javascript
async function getClasses(filters, user) {
  let query = db.classes.query()
    .where('deleted_at', null);
  
  // Permission: Giáo viên chỉ thấy lớp mình dạy
  if (user.role === 'teacher') {
    query = query.join('class_teachers', 'classes.id', 'class_teachers.class_id')
      .where('class_teachers.teacher_id', user.id);
  }
  
  // Filters
  if (filters.search) {
    query = query.where(function() {
      this.where('name', 'like', `%${filters.search}%`)
        .orWhere('code', 'like', `%${filters.search}%`);
    });
  }
  
  if (filters.level) {
    query = query.whereIn('level', filters.level.split(','));
  }
  
  if (filters.status) {
    query = query.whereIn('status', filters.status.split(','));
  }
  
  if (filters.teacher_id) {
    query = query.join('class_teachers', ...)
      .where('class_teachers.teacher_id', filters.teacher_id);
  }
  
  // Pagination
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 12;
  const offset = (page - 1) * limit;
  
  const total = await query.clone().count();
  const data = await query
    .limit(limit)
    .offset(offset)
    .orderBy(filters.sort || 'created_at', filters.order || 'desc');
  
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

---

### 6.5. Lấy chi tiết lớp học

**Endpoint:** `GET /api/v1/classes/:id`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "code": "B1-015",
    "name": "VSTEP B1 - Lớp 01",
    "level": "B1",
    "description": "...",
    "course": {
      "id": 5,
      "name": "Khóa B1 - 3 tháng"
    },
    "teachers": [
      {
        "id": 10,
        "name": "TS. Nguyễn Minh",
        "role": "primary",
        "email": "nguyenminh@vstepro.com"
      }
    ],
    "student_count": 25,
    "max_students": 30,
    "progress": 65.5,
    "status": "active",
    "schedule": {
      "days": [2, 4, 6],
      "start_time": "18:00",
      "end_time": "20:00",
      "display": "T2, T4, T6 | 18:00-20:00"
    },
    "start_date": "2024-12-15",
    "end_date": "2025-03-15",
    "stats": {
      "attendance_rate": 85.2,
      "avg_score": 7.4,
      "completed_lessons": 12,
      "total_lessons": 24
    },
    "created_at": "2024-12-11T10:30:00Z"
  }
}
```

---

### 6.6. Thêm học viên vào lớp

**Endpoint:** `POST /api/v1/classes/:id/students`

**Request Body:**
```json
{
  "student_ids": [101, 102, 103],
  "send_notification": true
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "added_count": 3,
    "new_student_count": 28
  },
  "message": "Đã thêm 3 học viên vào lớp"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "ERR_CLASS_FULL",
    "message": "Lớp đã đầy, không thể thêm học viên"
  }
}
```

**Logic xử lý:**
```javascript
async function addStudentsToClass(classId, studentIds, sendNotification) {
  const classData = await db.classes.findById(classId);
  
  // Validate: Lớp còn chỗ?
  const availableSlots = classData.max_students - classData.student_count;
  if (studentIds.length > availableSlots) {
    throw new ValidationError('ERR_CLASS_FULL');
  }
  
  // Check duplicate
  const existingStudents = await db.class_students
    .where({ class_id: classId })
    .pluck('student_id');
  
  const newStudents = studentIds.filter(id => !existingStudents.includes(id));
  
  // Insert
  const records = newStudents.map(student_id => ({
    class_id: classId,
    student_id,
    enrollment_date: new Date(),
    status: 'active'
  }));
  
  await db.class_students.insert(records);
  
  // Update student_count
  await db.classes.increment('student_count', newStudents.length)
    .where({ id: classId });
  
  // Send notification
  if (sendNotification) {
    await Promise.all(newStudents.map(id => 
      sendStudentNotification(id, classData)
    ));
  }
  
  return {
    added_count: newStudents.length,
    new_student_count: classData.student_count + newStudents.length
  };
}
```

---

### 6.7. Xóa học viên khỏi lớp

**Endpoint:** `DELETE /api/v1/classes/:id/students/:student_id`

**Request Body:**
```json
{
  "reason": "Học viên xin nghỉ học"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đã xóa học viên khỏi lớp"
}
```

**Logic xử lý:**
```javascript
async function removeStudentFromClass(classId, studentId, reason) {
  // Delete record
  await db.class_students.where({
    class_id: classId,
    student_id: studentId
  }).delete();
  
  // Update student_count
  await db.classes.decrement('student_count', 1)
    .where({ id: classId });
  
  // Audit log
  await createAuditLog({
    class_id: classId,
    action: 'student_removed',
    old_data: { student_id, reason }
  });
  
  // Send notification
  await sendStudentNotification(studentId, {
    type: 'removed_from_class',
    class_id: classId
  });
  
  return { success: true };
}
```

---

### 6.8. Gán/thay đổi giáo viên

**Endpoint:** `PUT /api/v1/classes/:id/teacher`

**Request Body:**
```json
{
  "teacher_id": 15,
  "role": "primary"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đã cập nhật giáo viên"
}
```

**Logic xử lý:**
```javascript
async function updateClassTeacher(classId, teacherId, role) {
  const classData = await db.classes.findById(classId);
  
  // Check schedule conflict
  const hasConflict = await checkTeacherScheduleConflict({
    teacher_id: teacherId,
    class_id: classId,
    schedule: classData.schedule
  });
  
  if (hasConflict) {
    throw new ConflictError('ERR_TEACHER_CONFLICT');
  }
  
  // Delete old teacher with same role
  await db.class_teachers.where({
    class_id: classId,
    role: role
  }).delete();
  
  // Insert new teacher
  await db.class_teachers.insert({
    class_id: classId,
    teacher_id: teacherId,
    role: role
  });
  
  // Update schedules (future sessions only)
  await db.schedules.update(
    {
      class_id: classId,
      date: { '>=': new Date() },
      status: 'scheduled'
    },
    { teacher_id: teacherId }
  );
  
  // Send notification
  await sendTeacherNotification(teacherId, classData);
  
  return { success: true };
}
```

---

## 7. Tổng kết và đề xuất

### 7.1. Tổng kết

Module **Quản lý lớp học** là một trong những module cốt lõi của nền tảng VSTEPRO, đòi hỏi:

✅ **Về nghiệp vụ:**
- Logic nghiệp vụ rõ ràng, đầy đủ validation
- Xử lý conflict schedule giữa giáo viên và lớp học
- Soft delete để giữ lại dữ liệu lịch sử
- Audit log chi tiết mọi thay đổi

✅ **Về UI/UX:**
- Giao diện trực quan, dễ sử dụng
- Filter/Search mạnh mẽ
- Wizard form (3 bước) cho tạo lớp
- Tabs navigation cho màn hình chi tiết
- Real-time updates

✅ **Về Database:**
- Thiết kế normalized, tránh redundancy
- Indexes hợp lý cho performance
- JSON fields cho dữ liệu linh hoạt (schedule_days, audit_log)

✅ **Về API:**
- RESTful design
- Error handling chuẩn
- Permission-based access
- Pagination, filter, sort

---

### 7.2. Đề xuất cải tiến

#### **Phase 2: Tính năng nâng cao**

1. **Auto-schedule generation:**
   - Tự động sinh lịch các buổi học dựa trên start_date, end_date, schedule_days
   - Loại trừ ngày lễ, Tết

2. **Conflict detection:**
   - Real-time warning khi tạo/sửa lớp
   - Hiển thị lớp conflict trên calendar

3. **Bulk operations:**
   - Import nhiều lớp từ Excel/CSV
   - Export danh sách lớp

4. **Attendance tracking:**
   - Điểm danh QR code
   - Báo cáo điểm danh chi tiết

5. **Class templates:**
   - Tạo template lớp học
   - Clone lớp từ template

6. **Waiting list:**
   - Danh sách chờ khi lớp đầy
   - Tự động thêm khi có chỗ trống

---

### 7.3. Performance optimization

1. **Database indexing:**
   - Thêm composite indexes cho query phức tạp
   - Partition table `schedules` theo năm

2. **Caching:**
   - Cache danh sách lớp (Redis)
   - Cache thống kê (tính toán nặng)

3. **Lazy loading:**
   - Load tabs on-demand
   - Infinite scroll cho danh sách học viên

---

### 7.4. Security considerations

1. **Permission checks:**
   - Middleware kiểm tra quyền trước khi xử lý
   - Row-level security (RLS)

2. **Input validation:**
   - Validate mọi input từ client
   - Sanitize SQL injection, XSS

3. **Rate limiting:**
   - Giới hạn số request tạo/xóa lớp
   - Chống spam API

---

**Kết luận:**

Tài liệu này cung cấp blueprint đầy đủ để triển khai module **Quản lý lớp học** cho VSTEPRO. Các developer có thể sử dụng làm reference để:
- Thiết kế database schema
- Implement API endpoints
- Xây dựng UI components
- Viết unit tests
- Deploy production

---

**Changelog:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 11/12/2024 | AI Assistant | Tạo tài liệu ban đầu |

---

**Liên hệ hỗ trợ:**  
Email: dev@vstepro.com  
Slack: #vstepro-dev
