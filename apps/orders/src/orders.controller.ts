import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.request';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) { }

  @Post('/create')
  async create(
    @Body() request: CreateOrderDto
  ) {
    return await this.ordersService.createOrder(request)
  }

  @Get('find')
  async find(
    @Query('name') name?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    return this.ordersService.findOrders({
      name,
      limit: +limit,
      page: +page
    })
  }
}
