import { Controller, Post, Body, Get, Param, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/users-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/users-signin.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guards';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guards';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { Roles } from 'src/utility/common/users-role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint de prueba
  @Get('test')
  async testEndpoint(): Promise<{ message: string }> {
    return { message: 'Test endpoint working!' };
  }

  //@AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
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

  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @Patch(':id/make-admin')
  async makeAdmin(@Param('id') id: number): Promise<UserEntity> {
    return this.usersService.makeAdmin(id);
  }
}
