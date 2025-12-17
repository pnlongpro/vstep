import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeDraft } from '../entities/practice-draft.entity';
import { SaveDraftDto } from '../dto/save-draft.dto';

@Injectable()
export class DraftSavingService {
  constructor(
    @InjectRepository(PracticeDraft)
    private readonly draftRepository: Repository<PracticeDraft>,
  ) {}

  /**
   * Save or update a draft
   */
  async saveDraft(userId: string, dto: SaveDraftDto): Promise<PracticeDraft> {
    // Calculate word count if not provided
    const wordCount = dto.wordCount ?? this.countWords(dto.content);

    // Find existing draft for this session/question combination
    let draft = await this.draftRepository.findOne({
      where: {
        userId,
        sessionId: dto.sessionId || undefined,
        questionId: dto.questionId || undefined,
      },
    });

    if (draft) {
      // Update existing draft
      draft.content = dto.content;
      draft.wordCount = wordCount;
      draft.version += 1;
      draft.autoSaved = dto.autoSaved ?? true;
    } else {
      // Create new draft
      draft = this.draftRepository.create({
        userId,
        sessionId: dto.sessionId,
        questionId: dto.questionId,
        content: dto.content,
        wordCount,
        autoSaved: dto.autoSaved ?? true,
      });
    }

    return this.draftRepository.save(draft);
  }

  /**
   * Get draft by session or question
   */
  async getDraft(
    userId: string,
    options: { sessionId?: string; questionId?: string },
  ): Promise<PracticeDraft | null> {
    return this.draftRepository.findOne({
      where: {
        userId,
        sessionId: options.sessionId || undefined,
        questionId: options.questionId || undefined,
      },
    });
  }

  /**
   * Get all drafts for a user
   */
  async getUserDrafts(userId: string): Promise<PracticeDraft[]> {
    return this.draftRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  /**
   * Get drafts for a session
   */
  async getSessionDrafts(userId: string, sessionId: string): Promise<PracticeDraft[]> {
    return this.draftRepository.find({
      where: { userId, sessionId },
      order: { updatedAt: 'DESC' },
    });
  }

  /**
   * Delete a draft
   */
  async deleteDraft(userId: string, draftId: string): Promise<void> {
    const draft = await this.draftRepository.findOne({
      where: { id: draftId, userId },
    });

    if (!draft) {
      throw new NotFoundException('Draft not found');
    }

    await this.draftRepository.remove(draft);
  }

  /**
   * Delete all drafts for a session (e.g., after submission)
   */
  async deleteSessionDrafts(userId: string, sessionId: string): Promise<void> {
    await this.draftRepository.delete({ userId, sessionId });
  }

  /**
   * Auto-save endpoint (throttled by frontend)
   */
  async autoSave(userId: string, dto: SaveDraftDto): Promise<{ success: boolean; version: number }> {
    const draft = await this.saveDraft(userId, { ...dto, autoSaved: true });
    return { success: true, version: draft.version };
  }

  private countWords(text: string): number {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }
}
