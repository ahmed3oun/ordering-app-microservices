import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
// TO be continued MIN 10
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
