import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";


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