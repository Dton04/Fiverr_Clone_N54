import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { SignInDto } from './dto/sign-in.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from '../../common/constants/app.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async signup(createAuthDto: CreateAuthDto) {
    const {
      email,
      password,
      name,
      phone,
      birthday,
      gender,
      role,
      skill,
      certification,
    } = createAuthDto;

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

    return {
      message: 'Đăng ký thành công',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    };
  }

  async signin(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.prisma.nguoiDung.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(password, user.pass_word || '');
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const tokens = await this.generateTokens(
      user.id,
      user.email || '',
      user.role || 'USER',
    );

    return {
      message: 'Đăng nhập thành công',
      tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      if (!refreshToken)
        throw new BadRequestException('Refresh token is required');

      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: REFRESH_TOKEN_SECRET,
      });

      const user = await this.prisma.nguoiDung.findFirst({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }

      const tokens = await this.generateTokens(
        user.id,
        user.email || '',
        user.role || 'USER',
      );

      return {
        message: 'Làm mới token thành công',
        tokens,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  private async generateTokens(id: number, email: string, role: string) {
    const payload = { id, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: ACCESS_TOKEN_SECRET,
        expiresIn: '5m',
      }),
      this.jwtService.signAsync(payload, {
        secret: REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
