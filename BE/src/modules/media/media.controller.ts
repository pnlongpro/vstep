import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  Res,
  ParseUUIDPipe,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Response } from "express";
import * as fs from "fs";
import { MediaService } from "./media.service";
import {
  UploadMediaDto,
  MediaQueryDto,
  UpdateMediaDto,
  MediaResponseDto,
  MediaListResponseDto,
} from "./dto/media.dto";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("Media")
@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max
      },
    })
  )
  @ApiOperation({ summary: "Upload a file" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
        customName: { type: "string" },
        category: {
          type: "string",
          enum: ["document", "audio", "video", "image"],
        },
      },
      required: ["file"],
    },
  })
  @ApiResponse({ status: 201, type: MediaResponseDto })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
    @Request() req
  ): Promise<{ success: boolean; data: MediaResponseDto }> {
    const media = await this.mediaService.upload(file, dto, req.user?.id);
    return {
      success: true,
      data: media,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all media files with pagination" })
  @ApiResponse({ status: 200, type: MediaListResponseDto })
  async findAll(@Query() query: MediaQueryDto): Promise<MediaListResponseDto> {
    return this.mediaService.findAll(query);
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get storage statistics (Admin only)" })
  async getStats() {
    return this.mediaService.getStats();
  }

  @Get("files/*")
  @ApiOperation({ summary: "Serve media file" })
  async serveFile(@Param("0") filePath: string, @Res() res: Response) {
    const fullPath = this.mediaService.getFilePath(filePath);

    if (!fs.existsSync(fullPath)) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "File not found",
      });
    }

    return res.sendFile(fullPath, { root: "." });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get media by ID" })
  @ApiResponse({ status: 200, type: MediaResponseDto })
  async findOne(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<MediaResponseDto> {
    const media = await this.mediaService.findById(id);
    return {
      id: media.id,
      originalName: media.originalName,
      storedName: media.storedName,
      url: media.url,
      mimeType: media.mimeType,
      size: media.size,
      sizeHuman: media.sizeHuman,
      category: media.category,
      status: media.status,
      referenceCount: media.referenceCount,
      uploadedById: media.uploadedById,
      createdAt: media.createdAt,
    };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update media metadata" })
  @ApiResponse({ status: 200, type: MediaResponseDto })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateMediaDto
  ): Promise<{ success: boolean; data: MediaResponseDto }> {
    const media = await this.mediaService.update(id, dto);
    return {
      success: true,
      data: media,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "uploader")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete media file (Admin/Uploader only)" })
  async delete(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("force") force: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    await this.mediaService.delete(id, force);
    return {
      success: true,
      message: "Media deleted successfully",
    };
  }

  @Post("cleanup")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Clean up orphaned media files (Admin only)" })
  async cleanup(
    @Query("olderThanDays") olderThanDays: number = 7
  ): Promise<{ success: boolean; deletedCount: number }> {
    const deletedCount = await this.mediaService.cleanupOrphaned(olderThanDays);
    return {
      success: true,
      deletedCount,
    };
  }
}
