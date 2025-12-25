import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddMediaIdToLearningDocuments1735000002 implements MigrationInterface {
  name = 'AddMediaIdToLearningDocuments1735000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add media_id column to learning_documents
    await queryRunner.addColumn(
      'learning_documents',
      new TableColumn({
        name: 'media_id',
        type: 'varchar',
        length: '36',
        isNullable: true,
      }),
    );

    // Add foreign key
    await queryRunner.createForeignKey(
      'learning_documents',
      new TableForeignKey({
        name: 'FK_learning_documents_media',
        columnNames: ['media_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'media',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('learning_documents', 'FK_learning_documents_media');
    await queryRunner.dropColumn('learning_documents', 'media_id');
  }
}
