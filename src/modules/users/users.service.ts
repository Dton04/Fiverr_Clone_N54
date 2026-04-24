import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { QueryUserDto } from './dto/query-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, phone, birthday, gender, role, skill, certification } = createUserDto;

    const existingUser = await this.prisma.nguoiDung.findFirst({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại trong hệ thống');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.prisma.nguoiDung.create({
      data: {
        email,
        pass_word: hashedPassword,
        name,
        phone,
        birth_day: birthday,
        gender: gender ? 'Male' : 'Female',
        role: role || 'USER',
        skill: skill ? skill.join(',') : '',
        certification: certification ? certification.join(',') : '',
      },
    });

    const { pass_word, ...result } = newUser;
    return result;
  }

  async findAll(query: QueryUserDto) {
    const page = Number(query.page) || 1;
    const size = Number(query.size) || 10;
    const search = query.search || '';
    const skip = (page - 1) * size;

    const whereCondition: any = {
      isDeleted: false,
    };

    if (search) {
      whereCondition.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const [data, totalItems] = await Promise.all([
      this.prisma.nguoiDung.findMany({
        where: whereCondition,
        skip: skip,
        take: size,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          birth_day: true,
          gender: true,
          role: true,
          skill: true,
          certification: true,
          createdAt: true,
          updatedAt: true,
        }
      }),
      this.prisma.nguoiDung.count({
        where: whereCondition,
      })
    ]);

    return {
      data,
      meta: {
        page,
        size,
        totalItems,
        totalPages: Math.ceil(totalItems / size),
      }
    };
  }

  async findOne(id: number) {
    const result = await this.prisma.nguoiDung.findUnique({
      where: {
        id: id,
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        skill: true,
        certification: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Check existence

    const updateData: any = { ...updateUserDto };

    // specific arrays handling
    if (updateData.skill) {
      updateData.skill = updateData.skill.join(',');
    }
    if (updateData.certification) {
      updateData.certification = updateData.certification.join(',');
    }
    if (updateData.gender !== undefined) {
      updateData.gender = updateData.gender ? 'Male' : 'Female';
    }

    const updatedUser = await this.prisma.nguoiDung.update({
      where: { id },
      data: updateData,
    });

    const { pass_word, ...result } = updatedUser;
    return result;
  }

  async remove(id: number) {
    await this.findOne(id); // Check existence

    await this.prisma.nguoiDung.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: 'Xóa tài khoản người dùng thành công' };
  }
}
