import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { CategoryEntity } from 'src/products/entities/category.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity])
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule { }