import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateChiTietLoaiCongViecDto {
  @ApiProperty({ description: 'Tên chi tiết loại công việc', example: 'Logo Design' })
  @IsString()
  ten_chi_tiet: string;

  @ApiPropertyOptional({ description: 'URL hình ảnh minh hoạ' })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiProperty({ description: 'Mã loại công việc cha', example: 1 })
  @Type(() => Number)
  @IsNumber()
  ma_loai_cong_viec: number;
}
