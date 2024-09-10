/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserEntity } from "src/users/entities/user.entity";
import { ProductEntity } from "src/products/entities/product.entity";

// Database table structure representation
@Entity({name:'categories'})
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt:Timestamp

    @UpdateDateColumn()
    updatedAt:Timestamp

    @ManyToOne(()=>UserEntity, (user)=>user.categories)
    addedBy:UserEntity;

    @OneToMany(()=>ProductEntity, (prod)=>prod.category)
    products:ProductEntity[];
}
