import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export async function seedNotifications(dataSource: DataSource) {
  console.log('🔔 Seeding notifications...');

  // Get a student user to add notifications
  const userResult = await dataSource.query(`
    SELECT u.id, u.email, u.first_name 
    FROM users u 
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    WHERE r.name = 'student' AND u.status = 'active'
    LIMIT 1
  `);

  if (userResult.length === 0) {
    console.log('⚠️ No student users found, skipping notification seeding');
    return;
  }

  const user = userResult[0];
  console.log(`📧 Creating notifications for user: ${user.email}`);

  const notifications = [
    {
      id: uuidv4(),
      user_id: user.id,
      type: 'system_welcome',
      title: 'Chào mừng đến VSTEPRO!',
      message: `Xin chào ${user.first_name || 'bạn'}! Hãy bắt đầu hành trình luyện thi VSTEP của bạn.`,
      icon: 'Smile',
      action_url: '/dashboard',
      action_type: 'navigate',
      is_read: true,
      read_at: new Date(),
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
      id: uuidv4(),
      user_id: user.id,
      type: 'badge_unlocked',
      title: '🎉 Huy hiệu mới!',
      message: 'Bạn đã mở khóa huy hiệu "Người mới bắt đầu"',
      icon: 'Trophy',
      action_url: '/achievements',
      action_type: 'navigate',
      is_read: true,
      read_at: new Date(),
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    },
    {
      id: uuidv4(),
      user_id: user.id,
      type: 'class_joined',
      title: 'Đã tham gia lớp học',
      message: 'Bạn đã được thêm vào lớp "VSTEP B2 - Tháng 1/2025"',
      icon: 'Users',
      action_url: '/student/classes',
      action_type: 'navigate',
      is_read: true,
      read_at: new Date(),
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      id: uuidv4(),
      user_id: user.id,
      type: 'assignment_new',
      title: 'Bài tập mới',
      message: 'Giáo viên đã giao bài tập mới "Writing Task 1 - Email" trong lớp VSTEP B2',
      icon: 'ClipboardList',
      action_url: '/student/assignments',
      action_type: 'navigate',
      is_read: false,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: uuidv4(),
      user_id: user.id,
      type: 'class_new_material',
      title: 'Tài liệu mới',
      message: 'Tài liệu mới "Từ vựng chủ đề Môi trường" đã được đăng trong lớp VSTEP B2',
      icon: 'FileText',
      action_url: '/student/classes',
      action_type: 'navigate',
      is_read: false,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: uuidv4(),
      user_id: user.id,
      type: 'assignment_due_soon',
      title: 'Bài tập sắp hết hạn',
      message: 'Bài tập "Writing Task 1 - Email" sẽ hết hạn trong 24 giờ',
      icon: 'Clock',
      action_url: '/student/assignments',
      action_type: 'navigate',
      is_read: false,
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      id: uuidv4(),
      user_id: user.id,
      type: 'streak_milestone',
      title: '🔥 Chuỗi 7 ngày!',
      message: 'Tuyệt vời! Bạn đã học liên tục 7 ngày. Hãy tiếp tục phát huy!',
      icon: 'Flame',
      action_url: '/dashboard',
      action_type: 'navigate',
      is_read: false,
      metadata: JSON.stringify({ streakDays: 7 }),
      created_at: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
  ];

  // Insert notifications
  for (const notification of notifications) {
    await dataSource.query(`
      INSERT INTO notifications (id, user_id, type, title, message, icon, action_url, action_type, is_read, read_at, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      notification.id,
      notification.user_id,
      notification.type,
      notification.title,
      notification.message,
      notification.icon,
      notification.action_url,
      notification.action_type,
      notification.is_read,
      notification.read_at || null,
      notification.metadata || null,
      notification.created_at,
    ]);
  }

  // Create default notification preferences for the user
  const prefId = uuidv4();
  await dataSource.query(`
    INSERT IGNORE INTO notification_preferences (id, user_id, email_assignments, email_classes, email_exams, email_system, email_marketing, email_frequency, inapp_enabled, inapp_sound, desktop_notifications, show_badge_count, created_at, updated_at)
    VALUES (?, ?, true, true, true, true, false, 'instant', true, true, false, true, NOW(), NOW())
  `, [prefId, user.id]);

  console.log(`✅ Created ${notifications.length} notifications for user: ${user.email}`);
  console.log(`✅ Created notification preferences for user: ${user.email}`);
}
