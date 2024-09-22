import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

// Data Transfer Object (DTO) data validation
export class CreateProductDto {
  @IsNotEmpty({ message: 'title can not be empty' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'description can not be empty' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'price can not be empty' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'price should be a number & max decimal precission 2' },
  )
  @IsPositive({ message: 'price should be a positive number' })
  price: number;

  @IsNotEmpty({ message: 'stock can not be empty' })
  @IsNumber({}, { message: 'stock should be a number' })
  @Min(0, { message: 'stock can not be negative.' })
  stock: number;

  @IsNotEmpty({ message: 'images can not be empty' })
  @IsArray({ message: 'images should be in array format' })
  images: string[];

  @IsNotEmpty({ message: 'categories can not be empty' })
  @IsNumber({}, { message: 'category id should be a number' })
  categoryId: number;
}
