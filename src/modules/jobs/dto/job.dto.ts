import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @ApiProperty({ description: 'Tên công việc', example: 'Thiết kế Logo chuyên nghiệp' })
  @IsString()
  ten_cong_viec: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết', example: 'Tôi sẽ thiết kế logo...' })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiPropertyOptional({ description: 'Mô tả ngắn', example: 'Logo design' })
  @IsOptional()
  @IsString()
  mo_ta_ngan?: string;

  @ApiPropertyOptional({ description: 'Giá tiền (VND)', example: 500000 })
  @IsOptional()
  @IsNumber()
  gia_tien?: number;

  @ApiPropertyOptional({ description: 'URL hình ảnh minh hoạ' })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiPropertyOptional({ description: 'Số sao đánh giá (1-5)', example: 5 })
  @IsOptional()
  @IsInt()
  sao_cong_viec?: number;

  @ApiPropertyOptional({ description: 'Mã chi tiết loại công việc', example: 1 })
  @IsOptional()
  @IsInt()
  ma_chi_tiet_loai?: number;
}

export class UpdateJobDto {
  @ApiPropertyOptional({ description: 'Tên công việc' })
  @IsOptional()
  @IsString()
  ten_cong_viec?: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết' })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiPropertyOptional({ description: 'Mô tả ngắn' })
  @IsOptional()
  @IsString()
  mo_ta_ngan?: string;

  @ApiPropertyOptional({ description: 'Giá tiền (VND)', example: 600000 })
  @IsOptional()
  @IsNumber()
  gia_tien?: number;

  @ApiPropertyOptional({ description: 'URL hình ảnh minh hoạ' })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiPropertyOptional({ description: 'Số sao đánh giá (1-5)', example: 4 })
  @IsOptional()
  @IsInt()
  sao_cong_viec?: number;

  @ApiPropertyOptional({ description: 'Mã chi tiết loại công việc', example: 2 })
  @IsOptional()
  @IsInt()
  ma_chi_tiet_loai?: number;
}

export class QueryJobDto {
  @ApiPropertyOptional({ description: 'Trang hiện tại', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng item / trang', example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 10;

  @ApiPropertyOptional({ description: 'Tìm kiếm theo tên công việc' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Lọc theo mã chi tiết loại', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ma_chi_tiet_loai?: number;
}
