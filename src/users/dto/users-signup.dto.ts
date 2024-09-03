import { IsNotEmpty, IsString } from 'class-validator';
import { UserSignInDto } from './users-signin.dto';

// data validation
export class UserSignUpDto extends UserSignInDto {
  @IsNotEmpty({ message: 'Name cannot be null' })
  @IsString({ message: 'Name should be a string' })
  name: string;
}
