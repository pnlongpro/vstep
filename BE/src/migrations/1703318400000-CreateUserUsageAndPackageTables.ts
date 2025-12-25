import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

export class CreateUserUsageAndPackageTables1703318400000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create user_usage table
        await queryRunner.createTable(
            new Table({
                name: 'user_usage',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'userId',
                        type: 'varchar',
                        length: '36',
                        isUnique: true,
                    },
                    {
                        name: 'mockTestsUsed',
                        type: 'int',
                        default: 0,
                        comment: 'Total mock tests completed',
                    },
                    {
                        name: 'aiSpeakingUsedToday',
                        type: 'int',
                        default: 0,
                        comment: 'AI Speaking sessions used today',
                    },
                    {
                        name: 'aiWritingUsedToday',
                        type: 'int',
                        default: 0,
                        comment: 'AI Writing submissions used today',
                    },
                    {
                        name: 'lastAiResetDate',
                        type: 'date',
                        isNullable: true,
                        comment: 'Last date AI usage was reset',
                    },
                    {
                        name: 'createdAt',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true
        );

        // Add foreign key for user_usage
        await queryRunner.createForeignKey(
            'user_usage',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            })
        );

        // Create user_packages table
        await queryRunner.createTable(
            new Table({
                name: 'user_packages',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'userId',
                        type: 'varchar',
                        length: '36',
                    },
                    {
                        name: 'plan',
                        type: 'enum',
                        enum: ['free', 'basic', 'premium'],
                        default: "'free'",
                    },
                    {
                        name: 'mockTestLimit',
                        type: 'int',
                        default: 3,
                        comment: 'Max mock tests allowed (0 = unlimited)',
                    },
                    {
                        name: 'aiSpeakingDailyLimit',
                        type: 'int',
                        default: 1,
                        comment: 'Max AI Speaking sessions per day (0 = unlimited)',
                    },
                    {
                        name: 'aiWritingDailyLimit',
                        type: 'int',
                        default: 1,
                        comment: 'Max AI Writing submissions per day (0 = unlimited)',
                    },
                    {
                        name: 'startDate',
                        type: 'datetime',
                        isNullable: true,
                        comment: 'When the package was activated',
                    },
                    {
                        name: 'endDate',
                        type: 'datetime',
                        isNullable: true,
                        comment: 'When the package expires (null = never)',
                    },
                    {
                        name: 'autoRenew',
                        type: 'boolean',
                        default: false,
                        comment: 'Auto-renew subscription',
                    },
                    {
                        name: 'isActive',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true
        );

        // Add indexes for user_packages
        await queryRunner.createIndex(
            'user_packages',
            new TableIndex({
                name: 'IDX_user_packages_userId',
                columnNames: ['userId'],
            })
        );

        await queryRunner.createIndex(
            'user_packages',
            new TableIndex({
                name: 'IDX_user_packages_plan',
                columnNames: ['plan'],
            })
        );

        // Add foreign key for user_packages
        await queryRunner.createForeignKey(
            'user_packages',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first
        const userUsageTable = await queryRunner.getTable('user_usage');
        if (userUsageTable) {
            const userUsageForeignKey = userUsageTable.foreignKeys.find(
                (fk) => fk.columnNames.indexOf('userId') !== -1
            );
            if (userUsageForeignKey) {
                await queryRunner.dropForeignKey('user_usage', userUsageForeignKey);
            }
        }

        const userPackagesTable = await queryRunner.getTable('user_packages');
        if (userPackagesTable) {
            const userPackagesForeignKey = userPackagesTable.foreignKeys.find(
                (fk) => fk.columnNames.indexOf('userId') !== -1
            );
            if (userPackagesForeignKey) {
                await queryRunner.dropForeignKey('user_packages', userPackagesForeignKey);
            }
        }

        // Drop indexes
        await queryRunner.dropIndex('user_packages', 'IDX_user_packages_userId');
        await queryRunner.dropIndex('user_packages', 'IDX_user_packages_plan');

        // Drop tables
        await queryRunner.dropTable('user_packages');
        await queryRunner.dropTable('user_usage');
    }

}
