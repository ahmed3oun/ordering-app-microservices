import { Inject, Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';

import { CreateOrderDto } from './dto/create-order.request';
import { BILLING_SERVICE } from './constants/services.constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy
  ) { }

  async createOrder(request: CreateOrderDto) {
    const session = await this.ordersRepo.startTransaction()
    try {
      const order = await this.ordersRepo.create(request, { session })
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request
        })
      );
      await session.commitTransaction()
      return order;
    } catch (error) {
      await session.abortTransaction()
      throw error;
    }
  }

  findOrders({ name, limit, page }: { name?: string; limit?: number; page?: number }) {
    return this.ordersRepo.find({
      name
    },
      limit,
      (limit * page + 1)
    )
  }
}
