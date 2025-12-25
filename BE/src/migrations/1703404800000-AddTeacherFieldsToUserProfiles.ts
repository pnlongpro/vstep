import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTeacherFieldsToUserProfiles1703404800000 implements MigrationInterface {
  name = 'AddTeacherFieldsToUserProfiles1703404800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add teacher-specific columns to user_profiles
    // Note: classCount và studentCount được tính từ bảng classes, không lưu cứng
    await queryRunner.addColumns('user_profiles', [
      new TableColumn({
        name: 'specialization',
        type: 'varchar',
        length: '100',
        isNullable: true,
        comment: 'Chuyên môn giảng dạy: Writing, Speaking, Reading, Listening, Grammar, etc.',
      }),
      new TableColumn({
        name: 'degree',
        type: 'varchar',
        length: '50',
        isNullable: true,
        comment: 'Bằng cấp: Tiến sĩ, Thạc sĩ, Cử nhân',
      }),
      new TableColumn({
        name: 'rating',
        type: 'decimal',
        precision: 2,
        scale: 1,
        default: 0,
        comment: 'Đánh giá trung bình (0-5)',
      }),
      new TableColumn({
        name: 'certifications',
        type: 'text',
        isNullable: true,
        comment: 'Chứng chỉ (comma-separated): IELTS, TESOL, CELTA, etc.',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_profiles', 'certifications');
    await queryRunner.dropColumn('user_profiles', 'rating');
    await queryRunner.dropColumn('user_profiles', 'degree');
    await queryRunner.dropColumn('user_profiles', 'specialization');
  }
}
