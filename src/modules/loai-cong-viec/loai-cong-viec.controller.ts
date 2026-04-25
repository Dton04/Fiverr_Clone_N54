import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LoaiCongViecService } from './loai-cong-viec.service';
import { CreateLoaiCongViecDto } from './dto/create-loai-cong-viec.dto';
import { UpdateLoaiCongViecDto } from './dto/update-loai-cong-viec.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('LoaiCongViec (Loại công việc)')
@Controller('loai-cong-viec')
export class LoaiCongViecController {
  constructor(private readonly loaiCongViecService: LoaiCongViecService) { }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Tạo loại công việc mới ' })
  @Post()
  create(@Body() createLoaiCongViecDto: CreateLoaiCongViecDto) {
    return this.loaiCongViecService.create(createLoaiCongViecDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Lấy danh sách phân loại công việc (Menu Tree)',
    description: 'Trả về tất cả LoaiCongViec kèm theo danh sách ChiTietLoaiCongViec con',
  })
  @Get()
  findAll() {
    return this.loaiCongViecService.findAll();
  }

  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết một loại công việc theo ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loaiCongViecService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Cập nhật loại công việc (ADMIN)' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLoaiCongViecDto: UpdateLoaiCongViecDto) {
    return this.loaiCongViecService.update(id, updateLoaiCongViecDto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Xóa loại công việc (ADMIN)' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.loaiCongViecService.remove(id);
  }
}
