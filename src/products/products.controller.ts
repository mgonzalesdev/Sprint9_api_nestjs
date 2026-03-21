import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorators';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  //Catalog  
  @Get('categories')
  getCategories() {
    return this.productsService.findAllCategories();
  }

  @Get('statuses')
  getStatuses() {
    return this.productsService.findAllStatuses();
  }

  @Get('conditions')
  getConditions() {
    return this.productsService.findAllConditions();
  }


  /*@Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER) // Solo el Admin puede registrar productos
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }*/
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    // Seguridad: Forzamos que el propietario sea el ID del Token, no el del Body
    const userId = req.user.userId;
    return this.productsService.create({ ...createProductDto, userId });
  }


  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto, @Req() req // 👈 Recibimos el usuario del Token
  ) {
    return this.productsService.update(id, updateProductDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }


}
