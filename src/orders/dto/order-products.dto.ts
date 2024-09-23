import {
  IsNotEmpty,
  isNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class OrderProductsDto {
  @IsNotEmpty({ message: 'Product can not be empty' })
  id: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price should be a number & max decimal precission 2' },
  )
  @IsPositive({ message: 'Price can not be Negative' })
  product_unit_price: number;

  @IsNumber({}, { message: 'Quantity should be number' })
  @IsPositive({ message: 'Quantity can not be Negative' })
  product_quantity: number;
}
