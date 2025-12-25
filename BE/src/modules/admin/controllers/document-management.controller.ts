import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { DocumentManagementService } from '../services';
import { BulkDocumentActionDto, CreateDocumentDto, DocumentFilterDto, UpdateDocumentDto, UpdateDocumentStatusDto } from '../dto/document-management.dto';

@ApiTags('Admin - Document Management')
@ApiBearerAuth()
@Controller('admin/documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'uploader')
export class DocumentManagementController {
  constructor(private readonly documentService: DocumentManagementService) {}

  @Get()
  @ApiOperation({ summary: 'List all learning documents with filters' })
  async findAll(@Query() filter: DocumentFilterDto) {
    return this.documentService.findAll(filter);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get document statistics' })
  async getStatistics() {
    return this.documentService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  async findById(@Param('id') id: string) {
    return this.documentService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new document' })
  async create(@Body() dto: CreateDocumentDto, @Req() req: any) {
    return this.documentService.create(dto, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update document' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentDto,
    @Req() req: any,
  ) {
    return this.documentService.update(id, dto, req.user.id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update document status (approve/reject/publish)' })
  @Roles('admin')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentStatusDto,
    @Req() req: any,
  ) {
    return this.documentService.updateStatus(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  @Roles('admin')
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.documentService.delete(id, req.user.id);
  }

  @Post('bulk-action')
  @ApiOperation({ summary: 'Perform bulk action on documents' })
  @Roles('admin')
  async bulkAction(@Body() dto: BulkDocumentActionDto, @Req() req: any) {
    return this.documentService.bulkAction(dto, req.user.id);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'Increment document view count' })
  async incrementViews(@Param('id') id: string) {
    await this.documentService.incrementViews(id);
    return { success: true };
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Increment document download count' })
  async incrementDownloads(@Param('id') id: string) {
    await this.documentService.incrementDownloads(id);
    return { success: true };
  }
}
