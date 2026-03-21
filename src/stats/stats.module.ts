import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([Product,User]) 
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
