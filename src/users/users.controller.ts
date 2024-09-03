import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/users-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/users-signin.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint de prueba
  @Get('test')
  async testEndpoint(): Promise<{ message: string }> {
    return { message: 'Test endpoint working!' };
  }

  @Post('signup')
  async signup(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<{ user: UserEntity }> {
    return { user: await this.usersService.signup(userSignUpDto) };
  }

  @Post('signin')
  async signin(@Body() userSignInDto: UserSignInDto) {
    const user = await this.usersService.signin(userSignInDto);
    const accessToken = await this.usersService.accessToken(user);
    return { accessToken, user };
  }
}
