import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CartStatus } from 'src/enums/carts';
import { CartEntity } from 'src/database/entities/carts.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    private dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<OrderEntity> {
    return this.orderRepository.findOneBy({ id });
  }

  async create(data: Order): Promise<OrderEntity> {
    const id = v4(v4());
    const order = {
      ...data,
      id,
      status: CartStatus.Open,
    };
    const newOrder = this.orderRepository.create(order);

    return this.orderRepository.save(newOrder);
  }

  async update(orderId: string, data): Promise<OrderEntity> {
    try {
      const order = await this.findById(orderId);

      if (!order) {
        throw new Error('Order does not exist.');
      }

      const updatedOrder = {
        ...data,
        id: orderId,
      };

      this.dataSource.transaction(async () => {
        await this.orderRepository.update({ id: orderId }, updatedOrder);
        await this.cartRepository.update(
          { id: data.cartId },
          { status: CartStatus.Ordered },
        );
      });

      return updatedOrder;
    } catch (error) {
      return error;
    }
  }
}
