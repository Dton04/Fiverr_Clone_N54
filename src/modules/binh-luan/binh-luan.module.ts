import { Module } from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { BinhLuanController } from './binh-luan.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BinhLuanController],
  providers: [BinhLuanService],
})
export class BinhLuanModule {}
