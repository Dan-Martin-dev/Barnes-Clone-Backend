import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { ShippingEntity } from './shipping.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderEntity } from './order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Entity({ name: 'orders_products' })
export class OrderProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  product_unit_price: number;

  @Column()
  product_quantiy: number;

  @ManyToOne(() => OrderEntity, (order) => order.products)
  order: OrderEntity;

  // multiple product orders can have only one 
  @ManyToOne(() => ProductEntity, (prod) => prod.products, {cascade:true})
  products: ProductEntity[];
}
