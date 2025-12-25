import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceLimitToUsers1766290535644 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add deviceLimit column to users table with default value 2
        await queryRunner.query(`
            ALTER TABLE users 
            ADD COLUMN deviceLimit INT NOT NULL DEFAULT 2
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove deviceLimit column
        await queryRunner.query(`
            ALTER TABLE users 
            DROP COLUMN deviceLimit
        `);
    }

}
