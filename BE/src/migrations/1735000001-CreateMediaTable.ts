import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateMediaTable1735000001 implements MigrationInterface {
  name = 'CreateMediaTable1735000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'media',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'original_name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'stored_name',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'path',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'url',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'size',
            type: 'bigint',
          },
          {
            name: 'size_human',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'enum',
            enum: ['document', 'audio', 'video', 'image'],
            default: "'document'",
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'orphaned', 'deleted'],
            default: "'active'",
          },
          {
            name: 'reference_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'uploaded_by_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'width',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'height',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'checksum',
            type: 'varchar',
            length: '64',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add indexes
    await queryRunner.createIndex(
      'media',
      new TableIndex({
        name: 'IDX_media_category',
        columnNames: ['category'],
      }),
    );

    await queryRunner.createIndex(
      'media',
      new TableIndex({
        name: 'IDX_media_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'media',
      new TableIndex({
        name: 'IDX_media_checksum',
        columnNames: ['checksum'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('media', 'IDX_media_checksum');
    await queryRunner.dropIndex('media', 'IDX_media_status');
    await queryRunner.dropIndex('media', 'IDX_media_category');
    await queryRunner.dropTable('media');
  }
}
