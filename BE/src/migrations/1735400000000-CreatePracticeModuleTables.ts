import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreatePracticeModuleTables1735400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========== EXAM_SETS TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: 'exam_sets',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true, generationStrategy: 'uuid' },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'level', type: 'enum', enum: ['A2', 'B1', 'B2', 'C1'] },
          { name: 'total_duration', type: 'int', comment: 'Total duration in minutes' },
          { name: 'total_questions', type: 'int', default: 0 },
          { name: 'status', type: 'enum', enum: ['draft', 'published', 'archived'], default: "'draft'" },
          { name: 'is_mock_test', type: 'boolean', default: false },
          { name: 'is_free', type: 'boolean', default: false },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'attempt_count', type: 'int', default: 0 },
          { name: 'average_score', type: 'decimal', precision: 4, scale: 2, isNullable: true },
          { name: 'thumbnail_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'created_by', type: 'varchar', length: '36', isNullable: true },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // ========== EXAM_SECTIONS TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: 'exam_sections',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true, generationStrategy: 'uuid' },
          { name: 'exam_set_id', type: 'varchar', length: '36' },
          { name: 'skill', type: 'enum', enum: ['reading', 'listening', 'writing', 'speaking'] },
          { name: 'title', type: 'varchar', length: '255', isNullable: true },
          { name: 'instructions', type: 'text', isNullable: true },
          { name: 'duration', type: 'int', comment: 'Duration in minutes' },
          { name: 'question_count', type: 'int', default: 0 },
          { name: 'order_index', type: 'int', default: 0 },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // ========== SECTION_PASSAGES TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: 'section_passages',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true, generationStrategy: 'uuid' },
          { name: 'section_id', type: 'varchar', length: '36' },
          { name: 'title', type: 'varchar', length: '255', isNullable: true },
          { name: 'content', type: 'longtext', isNullable: true, comment: 'Reading passage text' },
          { name: 'audio_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'audio_duration', type: 'int', isNullable: true, comment: 'Duration in seconds' },
          { name: 'audio_transcript', type: 'longtext', isNullable: true },
          { name: 'image_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'order_index', type: 'int', default: 0 },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // ========== QUESTION_TAGS TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: 'question_tags',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true, generationStrategy: 'uuid' },
          { name: 'name', type: 'varchar', length: '100', isUnique: true },
          { name: 'description', type: 'varchar', length: '255', isNullable: true },
          { name: 'category', type: 'varchar', length: '50', isNullable: true, comment: 'Tag category: topic, grammar, etc.' },
          { name: 'color', type: 'varchar', length: '7', isNullable: true, comment: 'Hex color code' },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // ========== QUESTIONS TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true, generationStrategy: 'uuid' },
          { name: 'passage_id', type: 'varchar', length: '36', isNullable: true },
          {
            name: 'type',
            type: 'enum',
            enum: ['multiple_choice', 'true_false_ng', 'matching', 'fill_blank', 'short_answer', 'essay', 'speaking_task'],
          },
          { name: 'skill', type: 'enum', enum: ['reading', 'listening', 'writing', 'speaking'] },
          { name: 'level', type: 'enum', enum: ['A2', 'B1', 'B2', 'C1'] },
          { name: 'difficulty', type: 'enum', enum: ['easy', 'medium', 'hard'], default: "'medium'" },
          { name: 'content', type: 'text' },
          { name: 'context', type: 'text', isNullable: true, comment: 'Additional context or instructions' },
          { name: 'correct_answer', type: 'text', isNullable: true },
          { name: 'explanation', type: 'text', isNullable: true, comment: 'Explanation for the answer' },
          { name: 'points', type: 'int', default: 1 },
          { name: 'order_index', type: 'int', default: 0 },
          { name: 'audio_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'image_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'word_limit', type: 'int', isNullable: true, comment: 'For essay questions' },
          { name: 'time_limit', type: 'int', isNullable: true, comment: 'Time limit in seconds for speaking' },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // ========== QUESTION_OPTIONS TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: 'question_options',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true, generationStrategy: 'uuid' },
          { name: 'question_id', type: 'varchar', length: '36' },
          { name: 'label', type: 'varchar', length: '10' },
          { name: 'content', type: 'text' },
          { name: 'is_correct', type: 'boolean', default: false },
          { name: 'order_index', type: 'int', default: 0 },
          { name: 'image_url', type: 'varchar', length: '500', isNullable: true },
        ],
      }),
      true,
    );

    // ========== QUESTION_TAG_MAPPING TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: 'question_tag_mapping',
        columns: [
          { name: 'question_id', type: 'varchar', length: '36' },
          { name: 'tag_id', type: 'varchar', length: '36' },
        ],
      }),
      true,
    );

    await queryRunner.createPrimaryKey('question_tag_mapping', ['question_id', 'tag_id']);

    // ========== PRACTICE_SESSIONS TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: 'practice_sessions',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true, generationStrategy: 'uuid' },
          { name: 'user_id', type: 'varchar', length: '36' },
          { name: 'section_id', type: 'varchar', length: '36', isNullable: true },
          { name: 'skill', type: 'enum', enum: ['reading', 'listening', 'writing', 'speaking'] },
          { name: 'level', type: 'enum', enum: ['A2', 'B1', 'B2', 'C1'] },
          { name: 'mode', type: 'enum', enum: ['practice', 'mock_test', 'review'], default: "'practice'" },
          { name: 'status', type: 'enum', enum: ['in_progress', 'paused', 'completed', 'abandoned', 'expired'], default: "'in_progress'" },
          { name: 'total_questions', type: 'int', default: 0 },
          { name: 'answered_count', type: 'int', default: 0 },
          { name: 'correct_count', type: 'int', default: 0 },
          { name: 'current_question_index', type: 'int', default: 0 },
          { name: 'score', type: 'decimal', precision: 5, scale: 2, isNullable: true },
          { name: 'max_score', type: 'decimal', precision: 5, scale: 2, isNullable: true },
          { name: 'time_limit', type: 'int', isNullable: true, comment: 'Time limit in seconds' },
          { name: 'time_spent', type: 'int', default: 0, comment: 'Time spent in seconds' },
          { name: 'started_at', type: 'datetime', isNullable: true },
          { name: 'paused_at', type: 'datetime', isNullable: true },
          { name: 'completed_at', type: 'datetime', isNullable: true },
          { name: 'expires_at', type: 'datetime', isNullable: true },
          { name: 'question_order', type: 'json', isNullable: true, comment: 'Question IDs in order' },
          { name: 'settings', type: 'json', isNullable: true, comment: 'Additional settings' },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // ========== PRACTICE_ANSWERS TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: 'practice_answers',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true, generationStrategy: 'uuid' },
          { name: 'session_id', type: 'varchar', length: '36' },
          { name: 'question_id', type: 'varchar', length: '36' },
          { name: 'answer', type: 'text', isNullable: true },
          { name: 'selected_option_id', type: 'varchar', length: '36', isNullable: true },
          { name: 'is_correct', type: 'boolean', isNullable: true },
          { name: 'score', type: 'decimal', precision: 5, scale: 2, default: 0 },
          { name: 'max_score', type: 'decimal', precision: 5, scale: 2, default: 1 },
          { name: 'time_spent', type: 'int', default: 0, comment: 'Seconds spent on this question' },
          { name: 'is_flagged', type: 'boolean', default: false },
          { name: 'answered_at', type: 'datetime', isNullable: true },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // ========== PRACTICE_DRAFTS TABLE ==========
    await queryRunner.createTable(
      new Table({
        name: 'practice_drafts',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true, generationStrategy: 'uuid' },
          { name: 'user_id', type: 'varchar', length: '36' },
          { name: 'session_id', type: 'varchar', length: '36', isNullable: true },
          { name: 'question_id', type: 'varchar', length: '36', isNullable: true },
          { name: 'content', type: 'longtext' },
          { name: 'version', type: 'int', default: 1 },
          { name: 'auto_saved_at', type: 'datetime', isNullable: true },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // ========== FOREIGN KEYS ==========

    // exam_sets -> users
    await queryRunner.createForeignKey(
      'exam_sets',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // exam_sections -> exam_sets
    await queryRunner.createForeignKey(
      'exam_sections',
      new TableForeignKey({
        columnNames: ['exam_set_id'],
        referencedTableName: 'exam_sets',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // section_passages -> exam_sections
    await queryRunner.createForeignKey(
      'section_passages',
      new TableForeignKey({
        columnNames: ['section_id'],
        referencedTableName: 'exam_sections',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // questions -> section_passages
    await queryRunner.createForeignKey(
      'questions',
      new TableForeignKey({
        columnNames: ['passage_id'],
        referencedTableName: 'section_passages',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // question_options -> questions
    await queryRunner.createForeignKey(
      'question_options',
      new TableForeignKey({
        columnNames: ['question_id'],
        referencedTableName: 'questions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // question_tag_mapping -> questions
    await queryRunner.createForeignKey(
      'question_tag_mapping',
      new TableForeignKey({
        columnNames: ['question_id'],
        referencedTableName: 'questions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // question_tag_mapping -> question_tags
    await queryRunner.createForeignKey(
      'question_tag_mapping',
      new TableForeignKey({
        columnNames: ['tag_id'],
        referencedTableName: 'question_tags',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // practice_sessions -> users
    await queryRunner.createForeignKey(
      'practice_sessions',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // practice_sessions -> exam_sections
    await queryRunner.createForeignKey(
      'practice_sessions',
      new TableForeignKey({
        columnNames: ['section_id'],
        referencedTableName: 'exam_sections',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // practice_answers -> practice_sessions
    await queryRunner.createForeignKey(
      'practice_answers',
      new TableForeignKey({
        columnNames: ['session_id'],
        referencedTableName: 'practice_sessions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // practice_answers -> questions
    await queryRunner.createForeignKey(
      'practice_answers',
      new TableForeignKey({
        columnNames: ['question_id'],
        referencedTableName: 'questions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // practice_drafts -> users
    await queryRunner.createForeignKey(
      'practice_drafts',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // practice_drafts -> practice_sessions
    await queryRunner.createForeignKey(
      'practice_drafts',
      new TableForeignKey({
        columnNames: ['session_id'],
        referencedTableName: 'practice_sessions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // practice_drafts -> questions
    await queryRunner.createForeignKey(
      'practice_drafts',
      new TableForeignKey({
        columnNames: ['question_id'],
        referencedTableName: 'questions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // ========== INDEXES ==========

    await queryRunner.createIndex(
      'exam_sets',
      new TableIndex({
        name: 'IDX_exam_sets_level_status',
        columnNames: ['level', 'status'],
      }),
    );

    await queryRunner.createIndex(
      'questions',
      new TableIndex({
        name: 'IDX_questions_skill_level_type',
        columnNames: ['skill', 'level', 'type'],
      }),
    );

    await queryRunner.createIndex(
      'questions',
      new TableIndex({
        name: 'IDX_questions_is_active',
        columnNames: ['is_active'],
      }),
    );

    await queryRunner.createIndex(
      'practice_sessions',
      new TableIndex({
        name: 'IDX_practice_sessions_user_status',
        columnNames: ['user_id', 'status'],
      }),
    );

    await queryRunner.createIndex(
      'practice_sessions',
      new TableIndex({
        name: 'IDX_practice_sessions_skill_level',
        columnNames: ['skill', 'level'],
      }),
    );

    await queryRunner.createIndex(
      'practice_answers',
      new TableIndex({
        name: 'IDX_practice_answers_session',
        columnNames: ['session_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.dropTable('practice_drafts');
    await queryRunner.dropTable('practice_answers');
    await queryRunner.dropTable('practice_sessions');
    await queryRunner.dropTable('question_tag_mapping');
    await queryRunner.dropTable('question_options');
    await queryRunner.dropTable('questions');
    await queryRunner.dropTable('question_tags');
    await queryRunner.dropTable('section_passages');
    await queryRunner.dropTable('exam_sections');
    await queryRunner.dropTable('exam_sets');
  }
}
