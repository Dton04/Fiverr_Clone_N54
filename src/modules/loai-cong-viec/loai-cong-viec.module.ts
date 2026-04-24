import { Module } from '@nestjs/common';
import { LoaiCongViecService } from './loai-cong-viec.service';
import { LoaiCongViecController } from './loai-cong-viec.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LoaiCongViecController],
  providers: [LoaiCongViecService],
})
export class LoaiCongViecModule {}

