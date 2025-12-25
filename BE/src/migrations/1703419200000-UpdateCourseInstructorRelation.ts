import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class UpdateCourseInstructorRelation1703419200000 implements MigrationInterface {
  name = 'UpdateCourseInstructorRelation1703419200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the old instructor column (string)
    await queryRunner.dropColumn('courses', 'instructor');
    
    // Drop the old students column (will be calculated from classes)
    await queryRunner.dropColumn('courses', 'students');
    
    // Add instructor_id column (UUID, nullable)
    await queryRunner.addColumn('courses', new TableColumn({
      name: 'instructor_id',
      type: 'char',
      length: '36',
      isNullable: true,
    }));
    
    // Add foreign key to users table
    await queryRunner.createForeignKey('courses', new TableForeignKey({
      name: 'FK_courses_instructor',
      columnNames: ['instructor_id'],
      referencedTableName: 'users',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    }));
    
    // Add index on instructor_id
    await queryRunner.createIndex('courses', new TableIndex({
      name: 'IDX_courses_instructor_id',
      columnNames: ['instructor_id'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key and index
    await queryRunner.dropForeignKey('courses', 'FK_courses_instructor');
    await queryRunner.dropIndex('courses', 'IDX_courses_instructor_id');
    
    // Drop instructor_id column
    await queryRunner.dropColumn('courses', 'instructor_id');
    
    // Re-add original columns
    await queryRunner.addColumn('courses', new TableColumn({
      name: 'instructor',
      type: 'varchar',
      length: '255',
      isNullable: true,
    }));
    
    await queryRunner.addColumn('courses', new TableColumn({
      name: 'students',
      type: 'int',
      default: 0,
    }));
  }
}
