import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto/category.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Categories (Phân loại công việc)')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ─── LoaiCongViec ─────────────────────────────────────────────────────────

  @Public()
  @ApiOperation({
    summary: 'Lấy danh sách phân loại công việc (Menu Tree)',
    description: 'Trả về tất cả LoaiCongViec kèm theo danh sách ChiTietLoaiCongViec con (không cần đăng nhập)',
  })
  @Get()
  findAll() {
    return this.categoriesService.findAllCategories();
  }

  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết một loại công việc theo ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOneCategory(id);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Tạo loại công việc mới (ADMIN)' })
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Cập nhật loại công việc (ADMIN)' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Xóa loại công việc (ADMIN)' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.removeCategory(id);
  }

  // ─── ChiTietLoaiCongViec ──────────────────────────────────────────────────

  @Public()
  @ApiOperation({ summary: 'Lấy danh sách chi tiết theo loại công việc' })
  @Get(':categoryId/details')
  findSubCategories(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoriesService.findSubCategoriesByCategory(categoryId);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Tạo chi tiết loại công việc (ADMIN)' })
  @Post(':categoryId/details')
  createSubCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() dto: CreateSubCategoryDto,
  ) {
    return this.categoriesService.createSubCategory(categoryId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Cập nhật chi tiết loại công việc (ADMIN)' })
  @Put('details/:id')
  updateSubCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    return this.categoriesService.updateSubCategory(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Xóa chi tiết loại công việc - soft delete (ADMIN)' })
  @Delete('details/:id')
  removeSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.removeSubCategory(id);
  }
}
