import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ThueCongViecService } from './thue-cong-viec.service';
import { CreateThueCongViecDto, UpdateThueCongViecDto } from './dto/thue-cong-viec.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiBearerAuth()
@ApiTags('ThueCongViec (Đặt cọc / Thuê)')
@Controller('thue-cong-viec')
export class ThueCongViecController {
  constructor(private readonly thueCongViecService: ThueCongViecService) {}

  @ApiOperation({ summary: 'Thuê/Đặt công việc (Cần đăng nhập)' })
  @Post()
  create(@Body() dto: CreateThueCongViecDto, @Req() req: any) {
    return this.thueCongViecService.create(dto, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Lấy danh sách tất cả lượt thuê (ADMIN)' })
  @Get()
  findAll() {
    return this.thueCongViecService.findAll();
  }

  @ApiOperation({ summary: 'Lấy danh sách các công việc ĐÃ THUÊ của bản thân (Cần đăng nhập)' })
  @Get('lay-danh-sach-da-thue')
  findMyBookings(@Req() req: any) {
    return this.thueCongViecService.findMyBookings(req.user.id);
  }

  @ApiOperation({ summary: 'Lấy chi tiết một lịch sử thuê (Theo ID)' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.thueCongViecService.findOne(id);
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái hoàn thành (Owner/ADMIN)' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateThueCongViecDto,
    @Req() req: any,
  ) {
    return this.thueCongViecService.update(id, dto, req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Xóa lịch sử thuê - soft delete (Owner/ADMIN)' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.thueCongViecService.remove(id, req.user.id, req.user.role);
  }
}
