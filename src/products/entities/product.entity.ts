import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatusEntity } from "./status.entity";
import { CategoryEntity } from "./category.entity";
import { ConditionEntity } from "./condition.entity";

@Entity('products')
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150 })
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @CreateDateColumn()
    publicationDate: Date;

    @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
    longitude: number;

    @Column({ nullable: true })
    image: string;
    // RELACIONES (Solo generan una columna ID en MySQL)

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => CategoryEntity, { nullable: false })
    category: CategoryEntity;

    @ManyToOne(() => ConditionEntity, { nullable: false })
    condition: ConditionEntity;

    @ManyToOne(() => StatusEntity, { nullable: false })
    status: StatusEntity;
}
