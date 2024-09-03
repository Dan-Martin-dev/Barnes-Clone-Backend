import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/users-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/users-signin.dto';
import { sign } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

// app business logic
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    if (userExists) throw new BadRequestException('Email is not available');

    userSignUpDto.password = await hash(userSignUpDto.password, 10);
    let user = this.usersRepository.create(userSignUpDto);
    user = await this.usersRepository.save(user);

    delete user.password;
    return user;
  }

  async signin(userSignInDto: UserSignInDto) {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userSignInDto.email })
      .getOne();

    if (!userExists) throw new BadRequestException('User dont exist.');

    const matchPassword = await compare(
      userSignInDto.password,
      userExists.password,
    );

    if (!matchPassword) throw new BadRequestException('Passwords dont match.');

    delete userExists.password;
    return userExists;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async accessToken(user: UserEntity) {
    return sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME },
    );
  }
}
