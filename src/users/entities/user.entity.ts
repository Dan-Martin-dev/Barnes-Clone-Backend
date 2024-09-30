/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Roles } from "src/utility/common/users-role.enum";
import { CategoryEntity } from "src/categories/entities/category.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { OrderEntity } from "src/orders/entities/order.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";

// database table structure representation
@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique:true})
    email: string;

    @Column({select:false})
    password: string;
    
    @Column({type:'enum', enum:Roles,array:true,default:[Roles.USER]})
    roles:Roles[]

    @CreateDateColumn()
    createdAt:Date
    
    @UpdateDateColumn()
    updatedAt:Date

    @OneToMany(()=>CategoryEntity, (cat)=>cat.addedBy)
    categories:CategoryEntity[]

    @OneToMany(()=>ProductEntity, (prod)=>prod.addedBy)
    products:ProductEntity[]

    @OneToMany(()=>OrderEntity, (order)=>order.updatedBy)
    ordersUpdatedBy:OrderEntity[];

    @OneToMany(()=>OrderEntity,(order)=>order.user)
    orders:OrderEntity[];
    
    @OneToMany(()=>ReviewEntity,(review)=>review.user)
    reviews:ReviewEntity[];
}
