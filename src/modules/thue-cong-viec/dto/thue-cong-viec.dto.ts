import { IsBoolean, IsDateString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateThueCongViecDto {
  @ApiProperty({ description: 'Mã công việc cần thuê', example: 1 })
  @Type(() => Number)
  @IsInt()
  ma_cong_viec: number;

  @ApiPropertyOptional({ description: 'Ngày thuê', example: '2026-05-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  ngay_thue?: string;
}

export class UpdateThueCongViecDto {
  @ApiPropertyOptional({ description: 'Trạng thái hoàn thành', example: true })
  @IsOptional()
  @IsBoolean()
  hoan_thanh?: boolean;
}
