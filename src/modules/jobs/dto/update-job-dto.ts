import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';



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