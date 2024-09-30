import { Get, Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import dataSource from 'db/data-source';

// Services are providers created as dependencies. They are responsible for fetching data and saving data to the database.
// Multiple controllers can inject a single service.

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(
      +createProductDto.categoryId,
    );
    const product = this.productRepository.create(createProductDto);
    product.category = category;
    product.addedBy = currentUser;
    return await this.productRepository.save(product);
  }

  async findAll(@Query() query: any): Promise<any> {
    let filteredTotalProducts: number;
    let limit: number;

    if (!query.limit) {
      limit = 4;
    } else {
      limit = query.limit;
    }
    const queryBuilder = dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('products')
      .leftJoinAndSelect('.product.category', 'category')
      .leftJoin('product.review', 'review')
      .addSelect([
        'COUNT(review.id) AS reviewCount',
        'AVG(review.ratings)::number(10,2) AS avgRating',
      ])
      .groupBy('product.id,category.id');

    const totalProducts = await queryBuilder.getCount();
    return totalProducts;
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'addedBy'], // Include related entities if needed
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async updateStock(id: number, stock: number, status: string) {
    let product = await this.findOne(id);

    if (status === OrderStatus.DELIVERED) {
      product.stock -= stock;
    } else {
      product.stock += stock;
    }
    product = await this.productRepository.save(product);
    return product;
  }
}
