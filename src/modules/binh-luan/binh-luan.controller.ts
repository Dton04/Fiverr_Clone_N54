import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { CreateBinhLuanDto, UpdateBinhLuanDto } from './dto/binh-luan.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('BinhLuan (Bình luận)')
@Controller('binh-luan')
export class BinhLuanController {
  constructor(private readonly binhLuanService: BinhLuanService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm bình luận mới (Cần đăng nhập, Yêu cầu: Đã từng thuê)' })
  @Post()
  create(@Body() dto: CreateBinhLuanDto, @Req() req: any) {
    return this.binhLuanService.create(dto, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Lấy tất cả bình luận (ADMIN)' })
  @Get()
  findAll() {
    return this.binhLuanService.findAll();
  }

  @Public()
  @ApiOperation({ summary: 'Lấy danh sách bình luận theo Mã Công Việc (Public)' })
  @Get('lay-binh-luan-theo-cong-viec/:MaCongViec')
  findByJobId(@Param('MaCongViec', ParseIntPipe) jobId: number) {
    return this.binhLuanService.findByJobId(jobId);
  }

  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết 1 bình luận theo ID (Public)' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.binhLuanService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật bình luận (Chỉ tác giả hoặc ADMIN)' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBinhLuanDto,
    @Req() req: any,
  ) {
    return this.binhLuanService.update(id, dto, req.user.id, req.user.role);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bình luận - soft delete (Chỉ tác giả hoặc ADMIN)' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.binhLuanService.remove(id, req.user.id, req.user.role);
  }
}
