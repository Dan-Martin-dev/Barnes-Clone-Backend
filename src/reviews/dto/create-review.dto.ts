import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNumber({}, { message: 'product should not be empty' })
  @IsNotEmpty({ message: 'product id should be a number' })
  productId: number;

  @IsString()
  @IsNotEmpty({ message: 'review should be have a name' })
  reviewerName: string;

  @IsString()
  @IsNotEmpty({ message: 'comments should not be empty' })
  comment: string;

  @IsNotEmpty({ message: 'ratings can not be empty' })
  @IsNumber()
  @Min(1)
  @Max(5)
  ratings: number;
}
