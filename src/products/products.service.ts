import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoryEntity } from './entities/category.entity';
import { StatusEntity } from './entities/status.entity';
import { ConditionEntity } from './entities/condition.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(StatusEntity) private readonly statusRepository: Repository<StatusEntity>,
    @InjectRepository(ConditionEntity) private readonly conditionRepository: Repository<ConditionEntity>,

  ) { }

  async create(createProductDto: any) {
    const newProduct = this.productRepository.create({
      name: createProductDto.name,
      description: createProductDto.description,
      latitude: Number(createProductDto.latitude),
      longitude: Number(createProductDto.longitude),
      image: createProductDto.image,
      user: { id: +createProductDto.userId },
      category: { id: +createProductDto.categoryId },
      condition: { id: +createProductDto.conditionId },
      status: { id: +createProductDto.statusId },
    });

    return await this.productRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['category', 'condition', 'status', 'user'],
      order: { publicationDate: 'DESC' },
    });
  }
  async findByUserId(userId: number): Promise<Product[]> {
    return await this.productRepository.find({
      where: { user: { id: userId } },
      relations: ['category', 'condition', 'status', 'user'],
      order: { id: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'condition', 'status', 'user']
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, currentUser: any): Promise<Product> {
    const product = await this.findOne(id);
    if (product.user.id !== currentUser.userId && currentUser.role !== 'admin') {
      throw new ForbiddenException('No tienes permiso para modificar este producto');
    }
    const updatedProduct = this.productRepository.merge(product, {
      ...updateProductDto,
      user: updateProductDto.userId ? { id: updateProductDto.userId } : product.user,
      category: updateProductDto.categoryId ? { id: updateProductDto.categoryId } : product.category,
      condition: updateProductDto.conditionId ? { id: updateProductDto.conditionId } : product.condition,
      status: updateProductDto.statusId ? { id: updateProductDto.statusId } : product.status,
    });

    return await this.productRepository.save(updatedProduct);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  findAllCategories() { return this.categoryRepository.find(); }
  findAllStatuses() { return this.statusRepository.find(); }
  findAllConditions() { return this.conditionRepository.find(); }

}
