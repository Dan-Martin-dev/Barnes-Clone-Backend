import { ValidateNested } from 'class-validator';
import { CreateShippingDto } from './create-shipping.dto';
import { Type } from 'class-transformer';
import { OrderProductsDto } from './order-products.dto';

export class CreateOrderDto {
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shippingAddress: CreateShippingDto;

  @Type(() => OrderProductsDto)
  @ValidateNested()
  orderedProducts: OrderProductsDto[];
}
