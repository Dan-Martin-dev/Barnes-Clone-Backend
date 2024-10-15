import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Entity({ name: 'reviews' })
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  comment: string;

  @Column()
  ratings: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.reviews)
  product: ProductEntity;
}
