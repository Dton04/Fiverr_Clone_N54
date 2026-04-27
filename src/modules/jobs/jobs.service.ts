import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { QueryJobDto } from './dto/query.job.dto';
import { CreateJobDto } from './dto/create-job-dto';
import { UpdateJobDto } from './dto/update-job-dto';

const JOB_SELECT = {
  id: true,
  ten_cong_viec: true,
  mo_ta: true,
  mo_ta_ngan: true,
  gia_tien: true,
  hinh_anh: true,
  sao_cong_viec: true,
  danh_gia: true,
  ma_chi_tiet_loai: true,
  nguoi_tao: true,
  createdAt: true,
  updatedAt: true,
  // Relations
  NguoiDung: {
    select: { id: true, name: true, email: true },
  },
  ChiTietLoaiCongViec: {
    select: {
      id: true,
      ten_chi_tiet: true,
      LoaiCongViec: { select: { id: true, ten_loai_cong_viec: true } },
    },
  },
} as const;

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async findAll(query: QueryJobDto) {
    const page = Number(query.page) || 1;
    const size = Number(query.size) || 10;
    const search = query.search || '';
    const skip = (page - 1) * size;

    const where: any = { isDeleted: false };

    if (search) {
      where.OR = [
        { ten_cong_viec: { contains: search } },
        { mo_ta_ngan: { contains: search } },
      ];
    }

    if (query.ma_chi_tiet_loai) {
      where.ma_chi_tiet_loai = Number(query.ma_chi_tiet_loai);
    }

    const [data, totalItems] = await Promise.all([
      this.prisma.congViec.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
        select: JOB_SELECT,
      }),
      this.prisma.congViec.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        size,
        totalItems,
        totalPages: Math.ceil(totalItems / size),
      },
    };
  }

  async findOne(id: number) {
    const job = await this.prisma.congViec.findFirst({
      where: { id, isDeleted: false },
      select: JOB_SELECT,
    });

    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }
    return job;
  }

  async create(dto: CreateJobDto, userId: number) {
    return this.prisma.congViec.create({
      data: {
        ten_cong_viec: dto.ten_cong_viec,
        mo_ta: dto.mo_ta,
        mo_ta_ngan: dto.mo_ta_ngan,
        gia_tien: dto.gia_tien,
        hinh_anh: dto.hinh_anh,
        sao_cong_viec: dto.sao_cong_viec,
        ma_chi_tiet_loai: dto.ma_chi_tiet_loai,
        nguoi_tao: userId,
      },
      select: JOB_SELECT,
    });
  }

  async update(id: number, dto: UpdateJobDto, userId: number, userRole: string) {
    const job = await this.findOne(id);

    // Only owner or ADMIN can update
    if (job.nguoi_tao !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa công việc này');
    }

    return this.prisma.congViec.update({
      where: { id },
      data: {
        ten_cong_viec: dto.ten_cong_viec,
        mo_ta: dto.mo_ta,
        mo_ta_ngan: dto.mo_ta_ngan,
        gia_tien: dto.gia_tien,
        hinh_anh: dto.hinh_anh,
        sao_cong_viec: dto.sao_cong_viec,
        ma_chi_tiet_loai: dto.ma_chi_tiet_loai,
      },
      select: JOB_SELECT,
    });
  }

  async remove(id: number, userId: number, userRole: string) {
    const job = await this.findOne(id);

    // Only owner or ADMIN can delete
    if (job.nguoi_tao !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xóa công việc này');
    }

    await this.prisma.congViec.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: 'Xóa công việc thành công' };
  }

  async findByUser(userId: number) {
    return this.prisma.congViec.findMany({
      where: { nguoi_tao: userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      select: JOB_SELECT,
    });
  }

  async uploadJobImage(
    jobId: number,
    file: Express.Multer.File,
    userId: number,
    userRole: string,
  ) {
    const job = await this.findOne(jobId);

    if (job.nguoi_tao !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền cập nhật hình ảnh công việc này');
    }

    const { url } = await this.cloudinaryService.uploadFile(file, 'fiverr/jobs');

    await this.prisma.congViec.update({
      where: { id: jobId },
      data: { hinh_anh: url },
    });

    return {
      message: 'Tải ảnh công việc thành công',
      url,
    };
  }
}
