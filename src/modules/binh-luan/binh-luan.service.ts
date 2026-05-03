import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateBinhLuanDto, UpdateBinhLuanDto } from './dto/binh-luan.dto';

@Injectable()
export class BinhLuanService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.binhLuan.findMany({
      where: { isDeleted: false },
      include: {
        NguoiDung: { select: { id: true, name: true, email: true, avatar: true } },
        CongViec: { select: { id: true, ten_cong_viec: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByJobId(jobId: number) {
    return this.prisma.binhLuan.findMany({
      where: { ma_cong_viec: jobId, isDeleted: false },
      include: {
        NguoiDung: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const comment = await this.prisma.binhLuan.findFirst({
      where: { id, isDeleted: false },
    });
    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }
    return comment;
  }

  async create(dto: CreateBinhLuanDto, userId: number) {
    const job = await this.prisma.congViec.findFirst({
      where: { id: dto.ma_cong_viec, isDeleted: false },
    });

    if (!job) {
      throw new NotFoundException('Công việc không tồn tại');
    }

    // Yêu cầu: User phải THUÊ công việc này rồi mới được phép BÌNH LUẬN
    const hasBooked = await this.prisma.thueCongViec.findFirst({
      where: {
        ma_cong_viec: dto.ma_cong_viec,
        ma_nguoi_thue: userId,
        isDeleted: false,
      },
    });

    if (!hasBooked) {
      throw new ForbiddenException('Bạn phải thuê công việc này trước khi có thể bình luận');
    }

    return this.prisma.binhLuan.create({
      data: {
        ma_cong_viec: dto.ma_cong_viec,
        ma_nguoi_binh_luan: userId,
        ngay_binh_luan: new Date(),
        noi_dung: dto.noi_dung,
        sao_binh_luan: dto.sao_binh_luan,
      },
    });
  }

  async update(id: number, dto: UpdateBinhLuanDto, userId: number, role: string) {
    const comment = await this.findOne(id);
    if (comment.ma_nguoi_binh_luan !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa bình luận này');
    }

    return this.prisma.binhLuan.update({
      where: { id },
      data: {
        noi_dung: dto.noi_dung,
        sao_binh_luan: dto.sao_binh_luan,
      },
    });
  }

  async remove(id: number, userId: number, role: string) {
    const comment = await this.findOne(id);

    // Chỉ người tạo hoặc admin ms xóa được
    if (comment.ma_nguoi_binh_luan !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    await this.prisma.binhLuan.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: 'Xóa bình luận thành công' };
  }
}
