import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderProductsEntity } from './entities/order-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';

// business logic
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderProductsEntity)
    private readonly opRepository: Repository<OrderProductsEntity>,
    private readonly productService: ProductsService,
  ) {}

  // Recibe datos de la orden y del usuario actual
  async create(
    createOrderDto: CreateOrderDto,
    currentUser: UserEntity,
  ): Promise<OrderEntity> {
    // 2) Crea un objeto para la dirección de envío:
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    // 3) Crea un objeto para la orden:
    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user = currentUser;

    // 4) Guarda la orden en la base de datos:
    const order = await this.orderRepository.save(orderEntity);

    // 5) Procesa los productos pedidos:
    const orderedProducts = Array.isArray(createOrderDto.orderedProducts)
      ? createOrderDto.orderedProducts
      : [];

    // 6) Crea una lista de productos de la orden:
    const opEntity = await Promise.all(
      orderedProducts.map(async (product) => {
        const productEntity = await this.productService.findOne(product.id);
        return {
          order: order, // Saved order instance
          product: productEntity, // Found product entity
          product_quantity: product.product_quantity,
          product_unit_price: product.product_unit_price,
        };
      }),
    );

    // 7) Guarda los productos en la base de datos:
    await this.opRepository
      .createQueryBuilder()
      .insert()
      .into(OrderProductsEntity)
      .values(opEntity)
      .execute();

    // 8) Devuelve la orden completa:
    return await this.findOne(order.id);
  }

  async findOne(orderId: number): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['shippingAddress', 'user', 'products'],
    });
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: { product: true },
      },
    });
  }

  async update(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: UserEntity,
  ) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');

    /* exception 1*/
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(`Order already ${order.status}`);
    }

    /*  exception 2  */
    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderStatusDto.status != OrderStatus.SHIPPED
    ) {
      throw new BadRequestException(`Delivery before shipped`);
    }

    /*  return order */
    if (
      updateOrderStatusDto.status === OrderStatus.SHIPPED &&
      order.status === OrderStatus.SHIPPED
    ) {
      return order;
    }

    /* shipped  */
    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }

    /* delivered  */
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
    }

    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order: OrderEntity, status: string) {
    for (const op of order.products) {
      await this.productService.updateStock(
        op.product.id,
        op.product_quantity,
        status,
      );
    }
  }

  async cancelled(id: number, currentUser: UserEntity) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status === OrderStatus.CANCELLED) return order;
    order.status = OrderStatus.CANCELLED;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    await this.stockUpdate(order, OrderStatus.CANCELLED);
    return order;
  }
}
