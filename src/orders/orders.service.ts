import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderProductsEntity } from './entities/order-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderProductsEntity)
    private readonly opRepository: Repository<OrderProductsEntity>,
    private readonly productService: ProductsService,
  ) {}

  // Recibe datos de la orden y del usuario actual
  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
    // 2) Crea un objeto para la dirección de envío:
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    // 3) Crea un objeto para la orden:
    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user = currentUser;

    // 4) Guarda la orden en la base de datos:
    const order = await this.orderRepository.save(orderEntity);

    // 5) Procesa los productos pedidos:
    const orderedProducts = Array.isArray(createOrderDto.orderedProducts)
      ? createOrderDto.orderedProducts
      : [];

    // 6) Crea una lista de productos de la orden:
    const opEntity = await Promise.all(
      orderedProducts.map(async (product) => {
        const productEntity = await this.productService.findOne(product.id);
        return {
          order: order, // Saved order instance
          product: productEntity, // Found product entity
          product_quantity: product.product_quantity,
          product_unit_price: product.product_unit_price,
        };
      }),
    );

    // 7) Guarda los productos en la base de datos:
    await this.opRepository
      .createQueryBuilder()
      .insert()
      .into(OrderProductsEntity)
      .values(opEntity)
      .execute();

    // 8) Devuelve la orden completa:
    return await this.findOne(order.id);
  }

  async findOne(orderId: number): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['shippingAddress', 'user', 'products'],
    });
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: { products: true },
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

/* 
create:
1) Recibe datos de la orden y del usuario actual: 
  La función create toma dos parámetros: 
    createOrderDto (los detalles de la orden) 
    y currentUser (el usuario que está haciendo la compra).

2) Crea un objeto para la dirección de envío: 
  Se crea un nuevo objeto ShippingEntity para guardar la información de la dirección de envío. 
  Luego, se copian los datos de la dirección (como teléfono, dirección, ciudad, etc.) 
  de createOrderDto.shippingAddress al objeto shippingEntity.

3) Crea un objeto para la orden: 
  Se crea un objeto OrderEntity que representará la orden. 
  Este objeto incluye la dirección de envío (shippingAddress) y la información del usuario que hace la orden (user).

4) Guarda la orden en la base de datos: 
  La orden se guarda en la base de datos usando orderRepository.save. 
  Esto almacena la orden y devuelve el objeto guardado, que incluye el id generado para la orden.

5) Procesa los productos pedidos: 
  Verifica si los productos ordenados (orderedProducts) son un array. 
  Si es así, los procesa. Si no, crea un array vacío.

6) Crea una lista de productos de la orden: 
  Usa la función map para recorrer cada producto en orderedProducts. 
  Para cada producto, crea un objeto con:
    orderId: El ID de la orden generada anteriormente.
    productId: El ID del producto que se está ordenando.
    product_quantity: La cantidad de ese producto que se ordenó.
    product_unit_price: El precio unitario del producto.

7) Guarda los productos en la base de datos: 
  Usando opRepository, inserta la lista de productos en la base de datos en la tabla OrderProductsEntity.

8) Devuelve la orden completa: 
  Finalmente, llama a findOne(order.id) para devolver los detalles completos de la orden que se acaba de crear, incluyendo los productos.
*/
