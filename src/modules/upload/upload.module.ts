import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [CloudinaryModule, PrismaModule],
  controllers: [UploadController],
})
export class UploadModule {}
