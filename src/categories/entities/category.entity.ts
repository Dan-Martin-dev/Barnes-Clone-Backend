/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { UserEntity } from "src/users/entities/user.entity";

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
}
