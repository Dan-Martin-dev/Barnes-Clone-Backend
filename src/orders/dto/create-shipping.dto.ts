import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty({ message: 'Phone can not be empty' })
  @IsString({ message: 'Phone format should be a string' })
  phone: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Name can not be empty' })
  name: string;

  @IsNotEmpty({ message: 'Adress can not be empty' })
  @IsString({ message: 'Adress format should be a string' })
  address: string;

  @IsNotEmpty({ message: 'City can not be empty' })
  @IsString({ message: 'City format should be a string' })
  city: string;

  @IsNotEmpty({ message: 'Post code can not be empty' })
  @IsString({ message: 'Post format should be a string' })
  postCode: string;

  @IsNotEmpty({ message: 'State can not be empty' })
  @IsString({ message: 'State format should be a string' })
  state: string;

  @IsNotEmpty({ message: 'Country can not be empty' })
  @IsString({ message: 'Country format should be a string' })
  country: string;
}
