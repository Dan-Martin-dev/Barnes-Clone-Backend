import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderEntity } from './order.entity';
import { UserEntity } from 'src/users/entities/user.entity';

// Database table representation 
@Entity({ name: 'shipping' })
export class ShippingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({ default: '' })
  adress: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postCode: string;

  @Column()
  state: string;

  @Column()
  country: string;

  // multiple orders can be placed by one user
  @OneToOne(() => OrderEntity, (order) => order.shippingAddress)
  order: OrderEntity;
}
