import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

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

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: any,
    @Req() req
  ) {
    // Cloudinary devuelve la URL en file.path
    //console.log('Archivo recibido:', file);
    const result = await this.cloudinaryService.uploadImage(file);
    const imageUrl = result?.secure_url || null;
    //console.log('URL generada por Cloudinary:', imageUrl);
    const userId = req.user.userId;

    return this.productsService.create({
      ...createProductDto,
      userId,
      image: imageUrl
    });
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
  update(@Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto, @Req() req
  ) {
    return this.productsService.update(id, updateProductDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Get('user/my-products')
  @UseGuards(JwtAuthGuard)
  async findMyProducts(@Req() req) {
    const userId = req.user.userId; // Extraído del JWT por el JwtStrategy
    return this.productsService.findByUserId(userId);
  }

}
