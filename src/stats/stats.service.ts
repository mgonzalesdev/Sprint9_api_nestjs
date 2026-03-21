import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/common/enums/role.enum';


@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    // Datos para (Pie)
    async getPieChartData() {
        return await this.productRepository
            .createQueryBuilder('product')
            .leftJoin('product.category', 'category')
            .select('category.name', 'label')
            .addSelect('COUNT(product.id)', 'value')
            .groupBy('category.id')
            .getRawMany();
    }
    // Datos para (Barra)
    async getBarChartData() {
        return await this.productRepository
            .createQueryBuilder('product')
            .select("DATE_FORMAT(product.publicationDate, '%m/%Y')", 'month')
            .addSelect('COUNT(product.id)', 'total')
            .where('product.publicationDate >= DATE_SUB(NOW(), INTERVAL 6 MONTH)')
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();
    }

    async getSummary() {
        const [totalProducts, activeProducts, totalUsers] = await Promise.all([
            this.productRepository.count(),
            this.productRepository.count({ where: { status: { name: 'Disponible' } } }),

            this.userRepository.count({
                where: { role: UserRole.USER } 
            }),
        ]);

        return { totalProducts, activeProducts, totalUsers };
    }
}
