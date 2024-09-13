import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { UserEntity } from 'src/users/entities/user.entity';

// database table structure representation
@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  orderAt: Timestamp;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;

  @Column({ nullable: true })
  shippedAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  // multiple orders can be placed by one user
  @ManyToOne(() => UserEntity, (user) => user.ordersUpdatedBy)
  updatedBy: UserEntity;
}
