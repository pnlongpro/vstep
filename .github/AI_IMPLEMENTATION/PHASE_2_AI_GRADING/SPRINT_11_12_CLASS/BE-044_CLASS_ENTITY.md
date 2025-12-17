# BE-044: Class Entity & Migration

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | BE-044 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 11-12 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | Phase 1 Complete |

---

## 🎯 Objective

Create Class entity và migration:
- Class table với teacher relationship
- Class-Student many-to-many relationship
- Invite code generation
- Status management

---

## 📝 Implementation

### 1. src/modules/classes/entities/class.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { ClassStudentEntity } from './class-student.entity';
import { ClassMaterialEntity } from './class-material.entity';

export enum ClassLevel {
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
}

export enum ClassStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

@Entity('classes')
export class ClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacherId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'teacherId' })
  teacher: UserEntity;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ClassLevel, nullable: true })
  level: ClassLevel;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ default: 30 })
  maxStudents: number;

  @Column({ length: 10, unique: true })
  inviteCode: string;

  @Column({ type: 'enum', enum: ClassStatus, default: ClassStatus.ACTIVE })
  status: ClassStatus;

  @OneToMany(() => ClassStudentEntity, (cs) => cs.class)
  students: ClassStudentEntity[];

  @OneToMany(() => ClassMaterialEntity, (cm) => cm.class)
  materials: ClassMaterialEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateInviteCode() {
    if (!this.inviteCode) {
      this.inviteCode = this.generateCode();
    }
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
```

### 2. src/modules/classes/entities/class-student.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { ClassEntity } from './class.entity';

export enum EnrollmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

@Entity('class_students')
@Unique(['classId', 'studentId'])
export class ClassStudentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  classId: number;

  @ManyToOne(() => ClassEntity, (c) => c.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  class: ClassEntity;

  @Column()
  studentId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'studentId' })
  student: UserEntity;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  status: EnrollmentStatus;

  @CreateDateColumn()
  enrolledAt: Date;
}
```

### 3. src/modules/classes/entities/class-material.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { ClassEntity } from './class.entity';

@Entity('class_materials')
export class ClassMaterialEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  classId: number;

  @ManyToOne(() => ClassEntity, (c) => c.materials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  class: ClassEntity;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  fileUrl: string;

  @Column({ length: 50, nullable: true })
  fileType: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column()
  uploadedBy: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'uploadedBy' })
  uploader: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
```

### 4. Migration

```typescript
// src/migrations/XXXXXX-create-class-tables.ts
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateClassTables1703100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Classes table
    await queryRunner.createTable(
      new Table({
        name: 'classes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'teacherId', type: 'int' },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'level',
            type: 'enum',
            enum: ['A2', 'B1', 'B2', 'C1'],
            isNullable: true,
          },
          { name: 'startDate', type: 'date', isNullable: true },
          { name: 'endDate', type: 'date', isNullable: true },
          { name: 'maxStudents', type: 'int', default: 30 },
          { name: 'inviteCode', type: 'varchar', length: '10', isUnique: true },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'completed'],
            default: "'active'",
          },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'classes',
      new TableForeignKey({
        columnNames: ['teacherId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'classes',
      new TableIndex({ columnNames: ['teacherId'] }),
    );
    await queryRunner.createIndex(
      'classes',
      new TableIndex({ columnNames: ['inviteCode'] }),
    );

    // Class students table
    await queryRunner.createTable(
      new Table({
        name: 'class_students',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'classId', type: 'int' },
          { name: 'studentId', type: 'int' },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'completed'],
            default: "'active'",
          },
          { name: 'enrolledAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        uniques: [{ columnNames: ['classId', 'studentId'] }],
      }),
    );

    await queryRunner.createForeignKey(
      'class_students',
      new TableForeignKey({
        columnNames: ['classId'],
        referencedTableName: 'classes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'class_students',
      new TableForeignKey({
        columnNames: ['studentId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Class materials table
    await queryRunner.createTable(
      new Table({
        name: 'class_materials',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'classId', type: 'int' },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'fileUrl', type: 'varchar', length: '500', isNullable: true },
          { name: 'fileType', type: 'varchar', length: '50', isNullable: true },
          { name: 'fileSize', type: 'int', isNullable: true },
          { name: 'uploadedBy', type: 'int' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'class_materials',
      new TableForeignKey({
        columnNames: ['classId'],
        referencedTableName: 'classes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'class_materials',
      new TableForeignKey({
        columnNames: ['uploadedBy'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('class_materials');
    await queryRunner.dropTable('class_students');
    await queryRunner.dropTable('classes');
  }
}
```

### 5. src/modules/classes/classes.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { ClassStudentEntity } from './entities/class-student.entity';
import { ClassMaterialEntity } from './entities/class-material.entity';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassEntity,
      ClassStudentEntity,
      ClassMaterialEntity,
    ]),
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
```

---

## ✅ Acceptance Criteria

- [ ] Migration runs successfully
- [ ] ClassEntity created with all fields
- [ ] Teacher relationship works
- [ ] Student enrollment M2M works
- [ ] Invite code auto-generates
- [ ] Materials relationship works
- [ ] Unique constraints enforced
- [ ] Indexes created for performance

---

## 🧪 Test

```typescript
describe('ClassEntity', () => {
  it('should generate invite code on insert', async () => {
    const classEntity = new ClassEntity();
    classEntity.name = 'Test Class';
    classEntity.teacherId = 1;
    
    classEntity.generateInviteCode();
    
    expect(classEntity.inviteCode).toBeDefined();
    expect(classEntity.inviteCode.length).toBe(8);
  });
});
```
