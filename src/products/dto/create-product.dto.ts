import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @Type(() => Number)
    userId: number;

    @IsNumber()
    @Type(() => Number)
    categoryId: number;

    @IsNumber()
    @Type(() => Number)
    conditionId: number;

    @IsNumber()
    @Type(() => Number)
    statusId: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    latitude?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    longitude?: number;
}
