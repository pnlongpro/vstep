import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDocumentsModule1734890000000 implements MigrationInterface {
  name = 'CreateDocumentsModule1734890000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create study_materials table
    await queryRunner.query(`
      CREATE TABLE \`study_materials\` (
        \`id\` varchar(36) NOT NULL,
        \`title\` varchar(255) NOT NULL,
        \`description\` text NULL,
        \`category\` enum('reading', 'listening', 'writing', 'speaking', 'grammar', 'vocabulary', 'tips', 'exams', 'general') NOT NULL DEFAULT 'general',
        \`level\` enum('all', 'a1', 'a2', 'b1', 'b2', 'c1') NOT NULL DEFAULT 'all',
        \`type\` varchar(50) NOT NULL,
        \`size\` int NOT NULL DEFAULT 0,
        \`url\` varchar(500) NOT NULL,
        \`thumbnailUrl\` varchar(500) NULL,
        \`pages\` int NULL,
        \`duration\` int NULL,
        \`tags\` json NULL,
        \`rating\` decimal(3,2) NOT NULL DEFAULT 0,
        \`ratingCount\` int NOT NULL DEFAULT 0,
        \`viewCount\` int NOT NULL DEFAULT 0,
        \`downloadCount\` int NOT NULL DEFAULT 0,
        \`visibility\` enum('public', 'student', 'teacher') NOT NULL DEFAULT 'public',
        \`status\` enum('draft', 'pending', 'published', 'rejected') NOT NULL DEFAULT 'draft',
        \`rejectionReason\` text NULL,
        \`mediaId\` varchar(36) NULL,
        \`uploadedById\` int NOT NULL,
        \`approvedById\` int NULL,
        \`publishedAt\` datetime NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create class_materials_v2 table
    await queryRunner.query(`
      CREATE TABLE \`class_materials_v2\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`description\` text NULL,
        \`course\` enum('vstep_a1', 'vstep_a2', 'vstep_b1', 'vstep_b2_1', 'vstep_b2_2', 'vstep_b2_intensive', 'vstep_c1', 'ielts_foundation', 'ielts_advanced', 'general_english') NOT NULL,
        \`unit\` int NULL,
        \`skill\` enum('reading', 'listening', 'writing', 'speaking', 'mixed') NOT NULL DEFAULT 'mixed',
        \`category\` enum('textbook', 'media') NOT NULL DEFAULT 'textbook',
        \`type\` varchar(50) NOT NULL,
        \`size\` int NOT NULL DEFAULT 0,
        \`url\` varchar(500) NOT NULL,
        \`thumbnailUrl\` varchar(500) NULL,
        \`duration\` int NULL,
        \`viewCount\` int NOT NULL DEFAULT 0,
        \`downloadCount\` int NOT NULL DEFAULT 0,
        \`status\` enum('draft', 'pending', 'published', 'rejected') NOT NULL DEFAULT 'draft',
        \`rejectionReason\` text NULL,
        \`mediaId\` varchar(36) NULL,
        \`uploadedById\` int NOT NULL,
        \`approvedById\` int NULL,
        \`publishedAt\` datetime NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create document_ratings table
    await queryRunner.query(`
      CREATE TABLE \`document_ratings\` (
        \`id\` varchar(36) NOT NULL,
        \`materialId\` varchar(36) NOT NULL,
        \`userId\` int NOT NULL,
        \`rating\` tinyint NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_document_rating_user\` (\`materialId\`, \`userId\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create document_bookmarks table
    await queryRunner.query(`
      CREATE TABLE \`document_bookmarks\` (
        \`id\` varchar(36) NOT NULL,
        \`materialId\` varchar(36) NOT NULL,
        \`userId\` int NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_document_bookmark_user\` (\`materialId\`, \`userId\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create document_views table
    await queryRunner.query(`
      CREATE TABLE \`document_views\` (
        \`id\` varchar(36) NOT NULL,
        \`materialId\` varchar(36) NOT NULL,
        \`materialType\` enum('study', 'class') NOT NULL,
        \`userId\` int NULL,
        \`ipAddress\` varchar(45) NULL,
        \`userAgent\` text NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create document_downloads table
    await queryRunner.query(`
      CREATE TABLE \`document_downloads\` (
        \`id\` varchar(36) NOT NULL,
        \`materialId\` varchar(36) NOT NULL,
        \`materialType\` enum('study', 'class') NOT NULL,
        \`userId\` int NULL,
        \`ipAddress\` varchar(45) NULL,
        \`userAgent\` text NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Add indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX \`IDX_study_material_category\` ON \`study_materials\` (\`category\`)
    `);
    await queryRunner.query(`
      CREATE INDEX \`IDX_study_material_level\` ON \`study_materials\` (\`level\`)
    `);
    await queryRunner.query(`
      CREATE INDEX \`IDX_study_material_status\` ON \`study_materials\` (\`status\`)
    `);
    await queryRunner.query(`
      CREATE INDEX \`IDX_study_material_visibility\` ON \`study_materials\` (\`visibility\`)
    `);
    await queryRunner.query(`
      CREATE INDEX \`IDX_study_material_uploaded_by\` ON \`study_materials\` (\`uploadedById\`)
    `);
    await queryRunner.query(`
      CREATE INDEX \`IDX_class_material_course\` ON \`class_materials_v2\` (\`course\`)
    `);
    await queryRunner.query(`
      CREATE INDEX \`IDX_class_material_status\` ON \`class_materials_v2\` (\`status\`)
    `);
    await queryRunner.query(`
      CREATE INDEX \`IDX_class_material_uploaded_by\` ON \`class_materials_v2\` (\`uploadedById\`)
    `);
    await queryRunner.query(`
      CREATE INDEX \`IDX_document_view_material\` ON \`document_views\` (\`materialId\`, \`materialType\`)
    `);
    await queryRunner.query(`
      CREATE INDEX \`IDX_document_download_material\` ON \`document_downloads\` (\`materialId\`, \`materialType\`)
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE \`study_materials\` 
      ADD CONSTRAINT \`FK_study_material_uploaded_by\` 
      FOREIGN KEY (\`uploadedById\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`study_materials\` 
      ADD CONSTRAINT \`FK_study_material_approved_by\` 
      FOREIGN KEY (\`approvedById\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`study_materials\` 
      ADD CONSTRAINT \`FK_study_material_media\` 
      FOREIGN KEY (\`mediaId\`) REFERENCES \`media\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`class_materials_v2\` 
      ADD CONSTRAINT \`FK_class_material_uploaded_by\` 
      FOREIGN KEY (\`uploadedById\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`class_materials_v2\` 
      ADD CONSTRAINT \`FK_class_material_approved_by\` 
      FOREIGN KEY (\`approvedById\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`class_materials_v2\` 
      ADD CONSTRAINT \`FK_class_material_media\` 
      FOREIGN KEY (\`mediaId\`) REFERENCES \`media\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`document_ratings\` 
      ADD CONSTRAINT \`FK_document_rating_user\` 
      FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`document_ratings\` 
      ADD CONSTRAINT \`FK_document_rating_material\` 
      FOREIGN KEY (\`materialId\`) REFERENCES \`study_materials\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`document_bookmarks\` 
      ADD CONSTRAINT \`FK_document_bookmark_user\` 
      FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE \`document_bookmarks\` 
      ADD CONSTRAINT \`FK_document_bookmark_material\` 
      FOREIGN KEY (\`materialId\`) REFERENCES \`study_materials\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.query(`ALTER TABLE \`document_bookmarks\` DROP FOREIGN KEY \`FK_document_bookmark_material\``);
    await queryRunner.query(`ALTER TABLE \`document_bookmarks\` DROP FOREIGN KEY \`FK_document_bookmark_user\``);
    await queryRunner.query(`ALTER TABLE \`document_ratings\` DROP FOREIGN KEY \`FK_document_rating_material\``);
    await queryRunner.query(`ALTER TABLE \`document_ratings\` DROP FOREIGN KEY \`FK_document_rating_user\``);
    await queryRunner.query(`ALTER TABLE \`class_materials_v2\` DROP FOREIGN KEY \`FK_class_material_media\``);
    await queryRunner.query(`ALTER TABLE \`class_materials_v2\` DROP FOREIGN KEY \`FK_class_material_approved_by\``);
    await queryRunner.query(`ALTER TABLE \`class_materials_v2\` DROP FOREIGN KEY \`FK_class_material_uploaded_by\``);
    await queryRunner.query(`ALTER TABLE \`study_materials\` DROP FOREIGN KEY \`FK_study_material_media\``);
    await queryRunner.query(`ALTER TABLE \`study_materials\` DROP FOREIGN KEY \`FK_study_material_approved_by\``);
    await queryRunner.query(`ALTER TABLE \`study_materials\` DROP FOREIGN KEY \`FK_study_material_uploaded_by\``);

    // Drop indexes
    await queryRunner.query(`DROP INDEX \`IDX_document_download_material\` ON \`document_downloads\``);
    await queryRunner.query(`DROP INDEX \`IDX_document_view_material\` ON \`document_views\``);
    await queryRunner.query(`DROP INDEX \`IDX_class_material_uploaded_by\` ON \`class_materials_v2\``);
    await queryRunner.query(`DROP INDEX \`IDX_class_material_status\` ON \`class_materials_v2\``);
    await queryRunner.query(`DROP INDEX \`IDX_class_material_course\` ON \`class_materials_v2\``);
    await queryRunner.query(`DROP INDEX \`IDX_study_material_uploaded_by\` ON \`study_materials\``);
    await queryRunner.query(`DROP INDEX \`IDX_study_material_visibility\` ON \`study_materials\``);
    await queryRunner.query(`DROP INDEX \`IDX_study_material_status\` ON \`study_materials\``);
    await queryRunner.query(`DROP INDEX \`IDX_study_material_level\` ON \`study_materials\``);
    await queryRunner.query(`DROP INDEX \`IDX_study_material_category\` ON \`study_materials\``);

    // Drop tables
    await queryRunner.query(`DROP TABLE \`document_downloads\``);
    await queryRunner.query(`DROP TABLE \`document_views\``);
    await queryRunner.query(`DROP TABLE \`document_bookmarks\``);
    await queryRunner.query(`DROP TABLE \`document_ratings\``);
    await queryRunner.query(`DROP TABLE \`class_materials_v2\``);
    await queryRunner.query(`DROP TABLE \`study_materials\``);
  }
}
