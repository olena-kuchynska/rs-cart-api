import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { CartDto } from '../dto/cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CartEntity } from '../../database/entities/carts.entity';
import { CartStatus } from '../../enums/carts';
import { CartItemEntity } from '../../database/entities/cart-items.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemRepository: Repository<CartItemEntity>,
  ) {}

  async findByUserId(userId: string): Promise<CartEntity> {
    return this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });
  }

  async createByUserId(userId: string): Promise<CartEntity> {
    const id = v4(v4());
    const userCart = {
      id,
      userId,
      items: [],
      status: CartStatus.Open,
    };
    const cart = this.cartRepository.create(userCart);

    return this.cartRepository.save(cart);
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    { items }: CartDto,
  ): Promise<CartEntity> {
    try {
      const { id, ...rest } = await this.findOrCreateByUserId(userId);

      Promise.all(
        items.map(({ product, count }) => {
          return this.cartItemRepository.update(
            { productId: product.id, cartId: id },
            { count },
          );
        }),
      );

      const updatedAt = new Date();

      await this.cartRepository.update({ id }, { updatedAt });

      return this.findByUserId(userId);
    } catch (error) {
      return error;
    }
  }

  async removeByUserId(userId: string): Promise<DeleteResult> {
    return this.cartRepository.delete({ userId })
  }
}
