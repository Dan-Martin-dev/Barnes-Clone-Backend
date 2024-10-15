import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ProductsModule } from 'src/products/products.module'; // Import ProductsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity]), // Register ReviewEntity with TypeOrmModule
    ProductsModule, // Import ProductsModule to provide ProductEntityRepository and ProductsService
  ],
  providers: [ReviewsService], // Only provide ReviewsService, ProductsService is handled by ProductsModule
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
