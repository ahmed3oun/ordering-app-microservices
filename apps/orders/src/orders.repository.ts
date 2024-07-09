import { AbstractRepository } from "@app/common";
import { Order } from "./schemas/order.schema";
import { Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";

export class OrdersRepository extends AbstractRepository<Order> {
    protected readonly logger: Logger = new Logger(OrdersRepository.name);
    constructor(
        @InjectModel(Order.name) orderModel: Model<Order>,
        @InjectConnection() connection: Connection,
    ) {
        super(orderModel, connection);
    }
}