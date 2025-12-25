import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateNotificationTables1736500000000 implements MigrationInterface {
  name = 'CreateNotificationTables1736500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create notifications table
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '36',
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              'assignment_new',
              'assignment_due_soon',
              'assignment_overdue',
              'assignment_graded',
              'assignment_submitted',
              'class_joined',
              'class_added',
              'class_new_material',
              'class_canceled',
              'class_announcement',
              'student_joined',
              'student_left',
              'exam_ready',
              'exam_result',
              'certificate_available',
              'system_welcome',
              'system_email_verified',
              'system_password_changed',
              'system_account_suspended',
              'system_premium_expires',
              'system_announcement',
              'badge_unlocked',
              'goal_achieved',
              'streak_milestone',
              'xp_earned',
              'level_up',
            ],
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'message',
            type: 'text',
          },
          {
            name: 'icon',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'action_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'action_type',
            type: 'enum',
            enum: ['navigate', 'modal', 'external'],
            default: "'navigate'",
          },
          {
            name: 'related_entity_type',
            type: 'enum',
            enum: ['assignment', 'class', 'exam', 'badge', 'goal', 'user', 'material'],
            isNullable: true,
          },
          {
            name: 'related_entity_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'is_read',
            type: 'boolean',
            default: false,
          },
          {
            name: 'read_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'is_deleted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'sent_in_app',
            type: 'boolean',
            default: true,
          },
          {
            name: 'sent_email',
            type: 'boolean',
            default: false,
          },
          {
            name: 'email_sent_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create indexes for notifications
    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_notifications_user_read',
        columnNames: ['user_id', 'is_read'],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_notifications_user_created',
        columnNames: ['user_id', 'created_at'],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'IDX_notifications_type',
        columnNames: ['type'],
      }),
    );

    // Create notification_preferences table
    await queryRunner.createTable(
      new Table({
        name: 'notification_preferences',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '36',
            isUnique: true,
          },
          // Email preferences
          {
            name: 'email_assignments',
            type: 'boolean',
            default: true,
          },
          {
            name: 'email_classes',
            type: 'boolean',
            default: true,
          },
          {
            name: 'email_exams',
            type: 'boolean',
            default: true,
          },
          {
            name: 'email_system',
            type: 'boolean',
            default: true,
          },
          {
            name: 'email_marketing',
            type: 'boolean',
            default: false,
          },
          {
            name: 'email_frequency',
            type: 'enum',
            enum: ['instant', 'daily', 'weekly', 'never'],
            default: "'instant'",
          },
          // In-app preferences
          {
            name: 'inapp_enabled',
            type: 'boolean',
            default: true,
          },
          {
            name: 'inapp_sound',
            type: 'boolean',
            default: true,
          },
          {
            name: 'desktop_notifications',
            type: 'boolean',
            default: false,
          },
          {
            name: 'show_badge_count',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'notification_preferences',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const notificationsTable = await queryRunner.getTable('notifications');
    if (notificationsTable) {
      const fk = notificationsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('user_id') !== -1,
      );
      if (fk) {
        await queryRunner.dropForeignKey('notifications', fk);
      }
    }

    const preferencesTable = await queryRunner.getTable('notification_preferences');
    if (preferencesTable) {
      const fk = preferencesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('user_id') !== -1,
      );
      if (fk) {
        await queryRunner.dropForeignKey('notification_preferences', fk);
      }
    }

    // Drop tables
    await queryRunner.dropTable('notification_preferences', true);
    await queryRunner.dropTable('notifications', true);
  }
}
