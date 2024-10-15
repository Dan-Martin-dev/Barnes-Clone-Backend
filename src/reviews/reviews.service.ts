import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly productService: ProductsService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    currentUser: UserEntity,
  ): Promise<ReviewEntity> {
    const product = await this.productService.findOne(
      createReviewDto.productId,
    );

    // Find an existing review by the current user for the product
    let review = await this.findOneByUserAndProduct(
      currentUser.id,
      createReviewDto.productId,
    );

    if (!review) {
      // If no review exists, create a new one
      review = this.reviewRepository.create(createReviewDto);
      review.user = currentUser;
      review.product = product;
    } else {
      // Update the existing review
      review.comment = createReviewDto.comment;
      review.ratings = createReviewDto.ratings;
    }

    // Save the review (either new or updated)
    return await this.reviewRepository.save(review);
  }

  async findOneByUserAndProduct(userId: number, productId: number) {
    return await this.reviewRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        product: {
          id: productId,
        },
      },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }

  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find({
      relations: ['user', 'product'], // Adjust based on required relations
    });
  }

  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
