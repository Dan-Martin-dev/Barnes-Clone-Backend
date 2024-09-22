import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { OrderProductsEntity } from 'src/orders/entities/order-products.entity';
import { ShippingEntity } from 'src/orders/entities/shipping.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderProductsEntity,
      ProductEntity,
      ShippingEntity,
    ]),
    CategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
