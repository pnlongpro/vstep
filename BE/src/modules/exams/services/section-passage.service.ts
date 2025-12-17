import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamSection } from '../entities/exam-section.entity';
import { SectionPassage } from '../entities/section-passage.entity';
import { CreateSectionDto } from '../dto/create-section.dto';
import { UpdateSectionDto } from '../dto/update-section.dto';
import { CreatePassageDto } from '../dto/create-passage.dto';
import { UpdatePassageDto } from '../dto/update-passage.dto';

@Injectable()
export class SectionPassageService {
  constructor(
    @InjectRepository(ExamSection)
    private readonly sectionRepository: Repository<ExamSection>,
    @InjectRepository(SectionPassage)
    private readonly passageRepository: Repository<SectionPassage>,
  ) {}

  // Section methods

  async createSection(dto: CreateSectionDto): Promise<ExamSection> {
    const section = this.sectionRepository.create(dto);
    return this.sectionRepository.save(section);
  }

  async findSectionById(id: string): Promise<ExamSection> {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: ['passages', 'passages.questions'],
    });
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return section;
  }

  async findSectionsByExamSet(examSetId: string): Promise<ExamSection[]> {
    return this.sectionRepository.find({
      where: { examSetId },
      relations: ['passages'],
      order: { orderIndex: 'ASC' },
    });
  }

  async updateSection(id: string, dto: UpdateSectionDto): Promise<ExamSection> {
    const section = await this.findSectionById(id);
    Object.assign(section, dto);
    return this.sectionRepository.save(section);
  }

  async deleteSection(id: string): Promise<void> {
    const section = await this.findSectionById(id);
    await this.sectionRepository.remove(section);
  }

  async reorderSections(examSetId: string, sectionIds: string[]): Promise<ExamSection[]> {
    const sections = await this.findSectionsByExamSet(examSetId);

    for (let i = 0; i < sectionIds.length; i++) {
      const section = sections.find((s) => s.id === sectionIds[i]);
      if (section) {
        section.orderIndex = i + 1;
        await this.sectionRepository.save(section);
      }
    }

    return this.findSectionsByExamSet(examSetId);
  }

  // Passage methods

  async createPassage(dto: CreatePassageDto): Promise<SectionPassage> {
    const passage = this.passageRepository.create(dto);
    return this.passageRepository.save(passage);
  }

  async findPassageById(id: string): Promise<SectionPassage> {
    const passage = await this.passageRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });
    if (!passage) {
      throw new NotFoundException(`Passage with ID ${id} not found`);
    }
    return passage;
  }

  async findPassagesBySection(sectionId: string): Promise<SectionPassage[]> {
    return this.passageRepository.find({
      where: { sectionId },
      relations: ['questions'],
      order: { orderIndex: 'ASC' },
    });
  }

  async updatePassage(id: string, dto: UpdatePassageDto): Promise<SectionPassage> {
    const passage = await this.findPassageById(id);
    Object.assign(passage, dto);
    return this.passageRepository.save(passage);
  }

  async deletePassage(id: string): Promise<void> {
    const passage = await this.findPassageById(id);
    await this.passageRepository.remove(passage);
  }

  async reorderPassages(sectionId: string, passageIds: string[]): Promise<SectionPassage[]> {
    const passages = await this.findPassagesBySection(sectionId);

    for (let i = 0; i < passageIds.length; i++) {
      const passage = passages.find((p) => p.id === passageIds[i]);
      if (passage) {
        passage.orderIndex = i + 1;
        await this.passageRepository.save(passage);
      }
    }

    return this.findPassagesBySection(sectionId);
  }
}
