# BE-064: Course Device Limit & User Devices

## dY"< Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-064 |
| **Phase** | 3 - Enterprise |
| **Sprint** | 15-16 |
| **Priority** | P1 |
| **Estimated Hours** | 4h |
| **Dependencies** | BE-062 (user_devices), BE-063 (course APIs), Auth session module |

---

## dYZ_ Objective

Thực thi giới hạn thiết bị theo Course spec:
- Lưu device login per user (`user_devices`).
- Chặn login khi vượt deviceLimit (theo course hoặc global).
- Cho phép xem/deregister thiết bị, force logout khi admin giảm limit.

---

## dY"? Requirements

1. **Data & Relations**
   - `user_devices`: userId FK, deviceType/name/browser/os/ipAddress, lastLogin, isActive, createdAt.
   - Link với session/auth flow: khi login thành công, ghi/refresh device record.
2. **Business rules**
   - Khi user login trên thiết bị mới: nếu count active >= deviceLimit (course.deviceLimit hoặc default=2) => trả lỗi `DEVICE_LIMIT_REACHED` + danh sách thiết bị hiện tại.
   - Cho phép user logout 1 thiết bị để nhường slot; cập nhật isActive=false.
   - Admin giảm deviceLimit: force logout thiết bị cũ nhất vượt limit, notify user (email/log) nếu cần.
3. **APIs**
   - `GET /api/users/:userId/devices` (self/admin).
   - `POST /api/auth/device-login` (hook trong login flow, không mở public riêng).
   - `DELETE /api/devices/:id` (self remove).
   - `DELETE /api/admin/devices/:id/force-logout` (admin).
4. **Permissions**
   - User: xem/xóa thiết bị của mình.
   - Admin: xem/force logout mọi user.
5. **Edge cases**
   - Thiết bị cũ không hoạt động: TTL? -> nếu có lastLogin quá hạn, có thể auto-deactivate (configurable).
   - Đồng bộ sessions: khi force logout -> revoke session tokens tương ứng.

---

## dY'¯ Implementation

- Hook vào auth login: xác định device fingerprint (type/name/browser/os/ip), tìm hoặc tạo record, set isActive=true, lastLogin=now.
- Service limit check: lấy deviceLimit từ course (nếu user đăng nhập để học course), fallback global config.
- Force logout: revoke refresh/session tokens, set isActive=false.
- Optional: cron dọn thiết bị stale (>= 90 ngày).

---

## ƒo. Acceptance Criteria

- Khi đạt limit, login bị chặn và trả danh sách thiết bị đang active.
- User có thể xóa thiết bị để login thiết bị mới.
- Admin giảm limit -> thiết bị vượt hạn bị logout, sessions revoke.
- Bảng `user_devices` cập nhật chính xác lastLogin/isActive.

---

## dY¦ Testing

- Integration: login đủ limit -> bị chặn; xóa một thiết bị -> login được.
- Admin force logout -> token không dùng lại được.
- Stale cleanup (nếu làm) chạy an toàn, không xoá thiết bị active mới.
