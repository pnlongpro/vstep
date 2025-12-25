import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateLearningDocumentsToStudyMaterials1734890100000 implements MigrationInterface {
  name = 'MigrateLearningDocumentsToStudyMaterials1734890100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if learning_documents table exists
    const tableExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'learning_documents'
    `);

    if (tableExists[0].count === 0) {
      console.log('learning_documents table does not exist, skipping migration');
      return;
    }

    // Check if there is any data to migrate
    const count = await queryRunner.query(`SELECT COUNT(*) as count FROM learning_documents`);
    if (count[0].count === 0) {
      console.log('No data to migrate from learning_documents');
      // Just drop the old table
      await queryRunner.query(`DROP TABLE IF EXISTS learning_documents`);
      return;
    }

    // Migrate data from learning_documents to study_materials
    await queryRunner.query(`
      INSERT INTO study_materials (
        id,
        title,
        description,
        category,
        level,
        type,
        size,
        url,
        fileName,
        thumbnail,
        viewCount,
        downloadCount,
        visibility,
        status,
        rejectionReason,
        mediaId,
        uploadedById,
        approvedById,
        publishedAt,
        createdAt,
        updatedAt
      )
      SELECT
        id,
        title,
        description,
        CASE 
          WHEN category = 'general' THEN 'general'
          WHEN category = 'reading' THEN 'reading'
          WHEN category = 'listening' THEN 'listening'
          WHEN category = 'writing' THEN 'writing'
          WHEN category = 'speaking' THEN 'speaking'
          WHEN category = 'grammar' THEN 'grammar'
          WHEN category = 'vocabulary' THEN 'vocabulary'
          ELSE 'general'
        END as category,
        level,
        CASE
          WHEN type = 'pdf' THEN 'pdf'
          WHEN type = 'doc' THEN 'doc'
          WHEN type = 'video' THEN 'video'
          WHEN type = 'audio' THEN 'audio'
          WHEN type = 'ppt' THEN 'ppt'
          ELSE 'pdf'
        END as type,
        COALESCE(size, '0'),
        url,
        fileName,
        NULL as thumbnail,
        COALESCE(views, 0) as viewCount,
        COALESCE(downloads, 0) as downloadCount,
        CASE
          WHEN visibility = 'public' THEN 'public'
          WHEN visibility = 'student' THEN 'student'
          WHEN visibility = 'teacher' THEN 'teacher'
          ELSE 'public'
        END as visibility,
        CASE
          WHEN status = 'published' THEN 'published'
          WHEN status = 'pending' THEN 'pending'
          WHEN status = 'draft' THEN 'draft'
          WHEN status = 'rejected' THEN 'rejected'
          ELSE 'draft'
        END as status,
        rejectionReason,
        media_id,
        uploadedById,
        approvedById,
        approvedAt as publishedAt,
        createdAt,
        updatedAt
      FROM learning_documents
      ON DUPLICATE KEY UPDATE id = id
    `);

    console.log(`Migrated ${count[0].count} documents from learning_documents to study_materials`);

    // Drop old table after migration
    await queryRunner.query(`DROP TABLE IF EXISTS learning_documents`);
    console.log('Dropped learning_documents table');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Cannot restore - just log
    console.log('Cannot restore learning_documents table - data has been migrated to study_materials');
  }
}
