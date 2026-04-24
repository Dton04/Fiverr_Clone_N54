import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { multerOptions } from '../../common/cloudinary/multer.config';

@ApiBearerAuth()
@ApiTags('Upload (Tải lên)')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prisma: PrismaService,
  ) { }

  @ApiOperation({
    summary: 'Upload avatar cho người dùng (cần đăng nhập)',
    description: 'Upload ảnh đại diện cho tài khoản đang đăng nhập. Chỉ cho phép ảnh JPEG, PNG, WebP, tối đa 5MB.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File ảnh đại diện',
        },
      },
    },
  })
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadAvatar(
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
    const userId = req.user.id;

    const { url } = await this.cloudinaryService.uploadFile(
      file,
      'fiverr/avatars',
    );

    await this.prisma.nguoiDung.update({
      where: { id: userId },
      data: { avatar: url } as any,
    });

    return {
      message: 'Tải ảnh đại diện thành công',
      url,
    };
  }

  @ApiOperation({
    summary: 'Upload hình ảnh cho công việc (cần đăng nhập)',
    description: 'Upload ảnh minh hoạ cho Gig/Công Việc. Chỉ cho phép ảnh JPEG, PNG, WebP, tối đa 5MB.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File ảnh công việc',
        },
      },
    },
  })
  @Post('job-image')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadJobImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpeg|jpg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const { url } = await this.cloudinaryService.uploadFile(
      file,
      'fiverr/jobs',
    );

    return {
      message: 'Tải ảnh công việc thành công',
      url,
    };
  }
}
