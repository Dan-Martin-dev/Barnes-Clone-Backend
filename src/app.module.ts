import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source.';
import { TestModule } from './test/test.module';
import { Test1Controller } from './test1/test1.controller';
import { Test1Service } from './test1/test1.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), TestModule, UsersModule],
  controllers: [AppController, Test1Controller],
  providers: [AppService, Test1Service],
})

export class AppModule {}
