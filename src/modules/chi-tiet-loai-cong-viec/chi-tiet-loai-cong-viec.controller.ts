import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ChiTietLoaiCongViecService } from './chi-tiet-loai-cong-viec.service';
import { CreateChiTietLoaiCongViecDto } from './dto/create-chi-tiet-loai-cong-viec.dto';
import { UpdateChiTietLoaiCongViecDto } from './dto/update-chi-tiet-loai-cong-viec.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('ChiTietLoaiCongViec (Chi tiết loại công việc)')
@Controller('chi-tiet-loai-cong-viec')
export class ChiTietLoaiCongViecController {
  constructor(private readonly chiTietLoaiCongViecService: ChiTietLoaiCongViecService) { }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Tạo chi tiết loại công việc (ADMIN)' })
  @Post()
  create(@Body() createChiTietLoaiCongViecDto: CreateChiTietLoaiCongViecDto) {
    return this.chiTietLoaiCongViecService.create(createChiTietLoaiCongViecDto);
  }

  @Public()
  @ApiOperation({ summary: 'Lấy tất cả chi tiết loại công việc' })
  @Get()
  findAll() {
    return this.chiTietLoaiCongViecService.findAll();
  }

  @Public()
  @ApiOperation({ summary: 'Lấy danh sách chi tiết theo loại công việc' })
  @Get('by-category/:categoryId')
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.chiTietLoaiCongViecService.findSubCategoriesByCategory(categoryId);
  }

  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết một loại công việc theo ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chiTietLoaiCongViecService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Cập nhật chi tiết loại công việc (ADMIN)' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateChiTietLoaiCongViecDto: UpdateChiTietLoaiCongViecDto) {
    return this.chiTietLoaiCongViecService.update(id, updateChiTietLoaiCongViecDto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Xóa chi tiết loại công việc - soft delete (ADMIN)' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chiTietLoaiCongViecService.remove(id);
  }
}
