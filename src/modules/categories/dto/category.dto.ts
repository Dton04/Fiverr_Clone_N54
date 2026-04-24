import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Tên loại công việc', example: 'Graphic Design' })
  @IsString()
  ten_loai_cong_viec: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Tên loại công việc', example: 'Graphic & Design' })
  @IsOptional()
  @IsString()
  ten_loai_cong_viec?: string;
}

export class CreateSubCategoryDto {
  @ApiProperty({ description: 'Tên chi tiết loại công việc', example: 'Logo Design' })
  @IsString()
  ten_chi_tiet: string;

  @ApiPropertyOptional({ description: 'URL hình ảnh minh hoạ', example: 'https://...' })
  @IsOptional()
  @IsString()
  hinh_anh?: string;
}

export class UpdateSubCategoryDto {
  @ApiPropertyOptional({ description: 'Tên chi tiết loại công việc', example: 'Logo & Brand Design' })
  @IsOptional()
  @IsString()
  ten_chi_tiet?: string;

  @ApiPropertyOptional({ description: 'URL hình ảnh minh hoạ' })
  @IsOptional()
  @IsString()
  hinh_anh?: string;
}
