import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTeacherFieldsToUserProfile1735400100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if columns exist before adding
    const table = await queryRunner.getTable('user_profiles');
    
    if (!table.findColumnByName('specialization')) {
      await queryRunner.addColumn(
        'user_profiles',
        new TableColumn({
          name: 'specialization',
          type: 'varchar',
          length: '255',
          isNullable: true,
        }),
      );
    }

    if (!table.findColumnByName('degree')) {
      await queryRunner.addColumn(
        'user_profiles',
        new TableColumn({
          name: 'degree',
          type: 'varchar',
          length: '100',
          isNullable: true,
        }),
      );
    }

    if (!table.findColumnByName('rating')) {
      await queryRunner.addColumn(
        'user_profiles',
        new TableColumn({
          name: 'rating',
          type: 'decimal',
          precision: 3,
          scale: 2,
          default: 0,
          isNullable: true,
        }),
      );
    }

    if (!table.findColumnByName('certifications')) {
      await queryRunner.addColumn(
        'user_profiles',
        new TableColumn({
          name: 'certifications',
          type: 'text',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_profiles');
    
    if (table.findColumnByName('certifications')) {
      await queryRunner.dropColumn('user_profiles', 'certifications');
    }
    
    if (table.findColumnByName('rating')) {
      await queryRunner.dropColumn('user_profiles', 'rating');
    }
    
    if (table.findColumnByName('degree')) {
      await queryRunner.dropColumn('user_profiles', 'degree');
    }
    
    if (table.findColumnByName('specialization')) {
      await queryRunner.dropColumn('user_profiles', 'specialization');
    }
  }
}
