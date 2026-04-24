import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { UploadModule } from './modules/upload/upload.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseSuccessInterceptor } from './common/interceptors/response.success.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ChiTietLoaiCongViecModule } from './modules/chi-tiet-loai-cong-viec/chi-tiet-loai-cong-viec.module';
import { LoaiCongViecModule } from './modules/loai-cong-viec/loai-cong-viec.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, UploadModule, JobsModule, ChiTietLoaiCongViecModule, LoaiCongViecModule],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseSuccessInterceptor },
  ],
})
export class AppModule { }
