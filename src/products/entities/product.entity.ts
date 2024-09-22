import { CategoryEntity } from 'src/categories/entities/category.entity';
import { OrderProductsEntity } from 'src/orders/entities/order-products.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

export class Product {}

// Database table structure representation
@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;
  @Column()
  stock: number;
  @Column('simple-array')
  images: string[];
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;

  // multiple products can have one user
  @ManyToOne(() => UserEntity, (user) => user.products)
  addedBy: UserEntity;

  @ManyToOne(() => CategoryEntity, (cat) => cat.products)
  category: CategoryEntity;

  // one product can have multiple product orders.
  @OneToMany(() => OrderProductsEntity, (op) => op.products)
  products: OrderProductsEntity[];
}
