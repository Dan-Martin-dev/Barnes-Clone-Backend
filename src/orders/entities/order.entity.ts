import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

import { OrderStatus } from '../enums/order-status.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { ShippingEntity } from './shipping.entity';
import { OrderProductsEntity } from './order-products.entity';

// database table structure representation
@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  orderAt: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;

  @Column({ nullable: true })
  shippedAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @OneToOne(() => ShippingEntity, (ship) => ship.order, { cascade: true })
  @JoinColumn()
  shippingAddress: ShippingEntity;

  // one order can have multiple products
  @OneToMany(() => OrderProductsEntity, (op) => op.order, { cascade: true })
  products: OrderProductsEntity[];

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.ordersUpdatedBy)
  updatedBy: UserEntity;
}
