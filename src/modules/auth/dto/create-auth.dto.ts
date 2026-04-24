import { IsArray, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({ description: 'Tên người dùng', example: 'Tan Dat' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email đăng nhập', example: 'dat@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Mật khẩu', example: '0123456' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Số điện thoại', example: '0123456789' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Ngày sinh', example: '2004-11-08' })
  @IsString()
  birthday: string;

  @ApiProperty({
    description: 'Giới tính (true = Nam, false = Nữ)',
    example: true,
  })
  @IsBoolean()
  gender: boolean;

  @ApiProperty({ description: 'Vai trò', example: 'USER' })
  @IsString()
  role: string;

  @ApiProperty({
    description: 'Kỹ năng',
    type: [String],
    example: ['React', 'NodeJS'],
  })
  @IsArray()
  @IsString({ each: true })
  skill: string[];

  @ApiProperty({
    description: 'Chứng chỉ',
    type: [String],
    example: ['AWS', 'IELTS'],
  })
  @IsArray()
  @IsString({ each: true })
  certification?: string[];
}
