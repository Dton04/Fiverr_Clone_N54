import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateLoaiCongViecDto } from './dto/create-loai-cong-viec.dto';
import { UpdateLoaiCongViecDto } from './dto/update-loai-cong-viec.dto';

@Injectable()
export class LoaiCongViecService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.loaiCongViec.findMany({
      include: {
        ChiTietLoaiCongViec: {
          where: { isDeleted: false },
          select: {
            id: true,
            ten_chi_tiet: true,
            hinh_anh: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.loaiCongViec.findUnique({
      where: { id },
      include: {
        ChiTietLoaiCongViec: {
          where: { isDeleted: false },
          select: {
            id: true,
            ten_chi_tiet: true,
            hinh_anh: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy loại công việc');
    }
    return category;
  }

  async create(createLoaiCongViecDto: CreateLoaiCongViecDto) {
    return this.prisma.loaiCongViec.create({
      data: { ten_loai_cong_viec: createLoaiCongViecDto.ten_loai_cong_viec },
    });
  }

  async update(id: number, updateLoaiCongViecDto: UpdateLoaiCongViecDto) {
    await this.findOne(id);
    return this.prisma.loaiCongViec.update({
      where: { id },
      data: { ten_loai_cong_viec: updateLoaiCongViecDto.ten_loai_cong_viec },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.loaiCongViec.delete({ where: { id } });
    return { message: 'Xóa loại công việc thành công' };
  }
}
