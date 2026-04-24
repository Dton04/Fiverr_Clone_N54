import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateChiTietLoaiCongViecDto } from './dto/create-chi-tiet-loai-cong-viec.dto';
import { UpdateChiTietLoaiCongViecDto } from './dto/update-chi-tiet-loai-cong-viec.dto';

@Injectable()
export class ChiTietLoaiCongViecService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.chiTietLoaiCongViec.findMany({
      where: { isDeleted: false },
      select: { id: true, ten_chi_tiet: true, hinh_anh: true, ma_loai_cong_viec: true },
      orderBy: { id: 'asc' },
    });
  }

  async findSubCategoriesByCategory(categoryId: number) {
    return this.prisma.chiTietLoaiCongViec.findMany({
      where: { ma_loai_cong_viec: categoryId, isDeleted: false },
      select: { id: true, ten_chi_tiet: true, hinh_anh: true, ma_loai_cong_viec: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.chiTietLoaiCongViec.findFirst({
      where: { id, isDeleted: false },
    });
    if (!item) {
      throw new NotFoundException('Không tìm thấy chi tiết loại công việc');
    }
    return item;
  }

  async create(createChiTietLoaiCongViecDto: CreateChiTietLoaiCongViecDto) {
    const category = await this.prisma.loaiCongViec.findUnique({
      where: { id: createChiTietLoaiCongViecDto.ma_loai_cong_viec }
    });
    if (!category) {
      throw new NotFoundException('Không tìm thấy loại công việc');
    }

    return this.prisma.chiTietLoaiCongViec.create({
      data: {
        ten_chi_tiet: createChiTietLoaiCongViecDto.ten_chi_tiet,
        hinh_anh: createChiTietLoaiCongViecDto.hinh_anh,
        ma_loai_cong_viec: createChiTietLoaiCongViecDto.ma_loai_cong_viec,
      },
    });
  }

  async update(id: number, updateChiTietLoaiCongViecDto: UpdateChiTietLoaiCongViecDto) {
    await this.findOne(id);
    return this.prisma.chiTietLoaiCongViec.update({
      where: { id },
      data: {
        ten_chi_tiet: updateChiTietLoaiCongViecDto.ten_chi_tiet,
        hinh_anh: updateChiTietLoaiCongViecDto.hinh_anh,
        ma_loai_cong_viec: updateChiTietLoaiCongViecDto.ma_loai_cong_viec,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.chiTietLoaiCongViec.update({
      where: { id },
      data: { isDeleted: true },
    });
    return { message: 'Xóa chi tiết loại công việc thành công' };
  }
}
