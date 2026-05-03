import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateThueCongViecDto, UpdateThueCongViecDto } from './dto/thue-cong-viec.dto';

@Injectable()
export class ThueCongViecService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.thueCongViec.findMany({
      where: { isDeleted: false },
      include: {
        CongViec: { select: { id: true, ten_cong_viec: true, hinh_anh: true } },
        NguoiDung: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMyBookings(userId: number) {
    return this.prisma.thueCongViec.findMany({
      where: { ma_nguoi_thue: userId, isDeleted: false },
      include: {
        CongViec: { select: { id: true, ten_cong_viec: true, hinh_anh: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const booking = await this.prisma.thueCongViec.findFirst({
      where: { id, isDeleted: false },
    });
    if (!booking) {
      throw new NotFoundException('Không tìm thấy thông tin thuê công việc');
    }
    return booking;
  }

  async create(dto: CreateThueCongViecDto, userId: number) {
    const job = await this.prisma.congViec.findFirst({
      where: { id: dto.ma_cong_viec, isDeleted: false },
    });

    if (!job) {
      throw new NotFoundException('Công việc không tồn tại');
    }

    if (job.nguoi_tao === userId) {
      throw new ForbiddenException('Bạn không thể thuê công việc do chính mình phát hành');
    }

    return this.prisma.thueCongViec.create({
      data: {
        ma_cong_viec: dto.ma_cong_viec,
        ma_nguoi_thue: userId,
        ngay_thue: dto.ngay_thue ? new Date(dto.ngay_thue) : new Date(),
        hoan_thanh: false,
      },
    });
  }

  async update(id: number, dto: UpdateThueCongViecDto, userId: number, role: string) {
    const booking = await this.findOne(id);

    if (booking.ma_nguoi_thue !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa thông tin thuê này');
    }

    return this.prisma.thueCongViec.update({
      where: { id },
      data: { hoan_thanh: dto.hoan_thanh },
    });
  }

  async remove(id: number, userId: number, role: string) {
    const booking = await this.findOne(id);

    if (booking.ma_nguoi_thue !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xóa lịch sử thuê này');
    }

    await this.prisma.thueCongViec.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: 'Xóa lịch sử thuê thành công' };
  }
}
