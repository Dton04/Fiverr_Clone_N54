import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBinhLuanDto {
  @ApiProperty({ description: 'Mã công việc', example: 1 })
  @Type(() => Number)
  @IsInt()
  ma_cong_viec: number;

  @ApiProperty({ description: 'Nội dung bình luận', example: 'Công việc làm rất tốt!' })
  @IsString()
  noi_dung: string;

  @ApiProperty({ description: 'Số sao đánh giá (1-5)', example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  sao_binh_luan: number;
}

export class UpdateBinhLuanDto {
  @ApiPropertyOptional({ description: 'Nội dung bình luận', example: 'Chỉnh sửa: Công việc tuyệt vời!' })
  @IsOptional()
  @IsString()
  noi_dung?: string;

  @ApiPropertyOptional({ description: 'Số sao đánh giá (1-5)', example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  sao_binh_luan?: number;
}
