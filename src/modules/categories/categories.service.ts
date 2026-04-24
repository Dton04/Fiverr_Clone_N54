import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── LoaiCongViec ────────────────────────────────────────────────────────────

  async findAllCategories() {
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

  async findOneCategory(id: number) {
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

  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.loaiCongViec.create({
      data: { ten_loai_cong_viec: dto.ten_loai_cong_viec },
    });
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    await this.findOneCategory(id);
    return this.prisma.loaiCongViec.update({
      where: { id },
      data: { ten_loai_cong_viec: dto.ten_loai_cong_viec },
    });
  }

  async removeCategory(id: number) {
    await this.findOneCategory(id);
    // Hard delete for LoaiCongViec (no isDeleted field in schema)
    await this.prisma.loaiCongViec.delete({ where: { id } });
    return { message: 'Xóa loại công việc thành công' };
  }

  // ─── ChiTietLoaiCongViec ─────────────────────────────────────────────────────

  async findSubCategoriesByCategory(categoryId: number) {
    await this.findOneCategory(categoryId); // ensure parent exists
    return this.prisma.chiTietLoaiCongViec.findMany({
      where: { ma_loai_cong_viec: categoryId, isDeleted: false },
      select: { id: true, ten_chi_tiet: true, hinh_anh: true, ma_loai_cong_viec: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOneSubCategory(id: number) {
    const item = await this.prisma.chiTietLoaiCongViec.findFirst({
      where: { id, isDeleted: false },
    });
    if (!item) {
      throw new NotFoundException('Không tìm thấy chi tiết loại công việc');
    }
    return item;
  }

  async createSubCategory(categoryId: number, dto: CreateSubCategoryDto) {
    await this.findOneCategory(categoryId); // ensure parent exists
    return this.prisma.chiTietLoaiCongViec.create({
      data: {
        ten_chi_tiet: dto.ten_chi_tiet,
        hinh_anh: dto.hinh_anh,
        ma_loai_cong_viec: categoryId,
      },
    });
  }

  async updateSubCategory(id: number, dto: UpdateSubCategoryDto) {
    await this.findOneSubCategory(id);
    return this.prisma.chiTietLoaiCongViec.update({
      where: { id },
      data: { ten_chi_tiet: dto.ten_chi_tiet, hinh_anh: dto.hinh_anh },
    });
  }

  async removeSubCategory(id: number) {
    await this.findOneSubCategory(id);
    await this.prisma.chiTietLoaiCongViec.update({
      where: { id },
      data: { isDeleted: true },
    });
    return { message: 'Xóa chi tiết loại công việc thành công' };
  }
}
