import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClassDetailEntities1735100000000 implements MigrationInterface {
    name = 'AddClassDetailEntities1735100000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create class_schedules table
        await queryRunner.query(`
            CREATE TABLE \`class_schedules\` (
                \`id\` varchar(36) NOT NULL,
                \`class_id\` varchar(36) NOT NULL,
                \`title\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`date\` date NOT NULL,
                \`start_time\` time NOT NULL,
                \`end_time\` time NOT NULL,
                \`status\` enum('upcoming', 'completed', 'cancelled') NOT NULL DEFAULT 'upcoming',
                \`zoom_link\` varchar(500) NULL,
                \`location\` varchar(255) NULL,
                \`attendance_count\` int NOT NULL DEFAULT '0',
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                KEY \`FK_class_schedules_class\` (\`class_id\`),
                CONSTRAINT \`FK_class_schedules_class\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create class_announcements table
        await queryRunner.query(`
            CREATE TABLE \`class_announcements\` (
                \`id\` varchar(36) NOT NULL,
                \`class_id\` varchar(36) NOT NULL,
                \`title\` varchar(255) NOT NULL,
                \`content\` text NOT NULL,
                \`author_id\` varchar(36) NULL,
                \`is_pinned\` tinyint NOT NULL DEFAULT '0',
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                KEY \`FK_class_announcements_class\` (\`class_id\`),
                KEY \`FK_class_announcements_author\` (\`author_id\`),
                CONSTRAINT \`FK_class_announcements_class\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\` (\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_class_announcements_author\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create class_assignments table
        await queryRunner.query(`
            CREATE TABLE \`class_assignments\` (
                \`id\` varchar(36) NOT NULL,
                \`class_id\` varchar(36) NOT NULL,
                \`title\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`skill\` enum('reading', 'listening', 'writing', 'speaking', 'mixed') NOT NULL DEFAULT 'mixed',
                \`due_date\` datetime NULL,
                \`status\` enum('draft', 'published', 'closed') NOT NULL DEFAULT 'draft',
                \`total_points\` int NOT NULL DEFAULT '100',
                \`exam_set_id\` varchar(36) NULL,
                \`created_by\` varchar(36) NULL,
                \`submission_count\` int NOT NULL DEFAULT '0',
                \`graded_count\` int NOT NULL DEFAULT '0',
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                KEY \`FK_class_assignments_class\` (\`class_id\`),
                KEY \`FK_class_assignments_creator\` (\`created_by\`),
                CONSTRAINT \`FK_class_assignments_class\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\` (\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_class_assignments_creator\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create class_assignment_submissions table
        await queryRunner.query(`
            CREATE TABLE \`class_assignment_submissions\` (
                \`id\` varchar(36) NOT NULL,
                \`assignment_id\` varchar(36) NOT NULL,
                \`student_id\` varchar(36) NOT NULL,
                \`status\` enum('pending', 'grading', 'graded') NOT NULL DEFAULT 'pending',
                \`submitted_at\` datetime NULL,
                \`content\` text NULL,
                \`file_url\` varchar(500) NULL,
                \`score\` decimal(5,2) NULL,
                \`feedback\` text NULL,
                \`grader_id\` varchar(36) NULL,
                \`graded_at\` datetime NULL,
                \`word_count\` int NULL,
                \`duration\` varchar(20) NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                KEY \`FK_submissions_assignment\` (\`assignment_id\`),
                KEY \`FK_submissions_student\` (\`student_id\`),
                KEY \`FK_submissions_grader\` (\`grader_id\`),
                CONSTRAINT \`FK_submissions_assignment\` FOREIGN KEY (\`assignment_id\`) REFERENCES \`class_assignments\` (\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_submissions_student\` FOREIGN KEY (\`student_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_submissions_grader\` FOREIGN KEY (\`grader_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`class_assignment_submissions\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`class_assignments\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`class_announcements\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`class_schedules\``);
    }
}
