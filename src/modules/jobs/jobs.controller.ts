import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';

import { Public } from '../../common/decorators/public.decorator';
import { multerOptions } from '../../common/cloudinary/multer.config';
import { QueryJobDto } from './dto/query.job.dto';
import { CreateJobDto } from './dto/create-job-dto';
import { UpdateJobDto } from './dto/update-job-dto';

@ApiTags('Jobs (Công việc)')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Public()
  @ApiOperation({
    summary: 'Lấy danh sách công việc (phân trang, tìm kiếm, lọc theo loại)',
  })
  @Get()
  findAll(@Query() query: QueryJobDto) {
    return this.jobsService.findAll(query);
  }

  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết công việc theo ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách công việc của tôi (cần đăng nhập)' })
  @Get('by-user/me')
  findMyJobs(@Req() req: any) {
    return this.jobsService.findByUser(req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo công việc mới (cần đăng nhập)' })
  @Post()
  create(@Body() dto: CreateJobDto, @Req() req: any) {
    return this.jobsService.create(dto, req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật công việc (chỉ người tạo hoặc ADMIN)',
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJobDto,
    @Req() req: any,
  ) {
    return this.jobsService.update(id, dto, req.user.id, req.user.role);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa công việc - soft delete (chỉ người tạo hoặc ADMIN)' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.jobsService.remove(id, req.user.id, req.user.role);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload hình ảnh công việc (chỉ người tạo hoặc ADMIN)',
    description: 'Upload ảnh minh hoạ lên Cloudinary và cập nhật vào công việc. Tối đa 5MB.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'File ảnh công việc' },
      },
    },
  })
  @Post('upload-hinh-cong-viec/:MaCongViec')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadJobImage(
    @Param('MaCongViec', ParseIntPipe) jobId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpeg|jpg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.jobsService.uploadJobImage(jobId, file, req.user.id, req.user.role);
  }
}
