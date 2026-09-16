import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { OrderItemEntity } from "./entities/order-item.entity";
import { ProductModule } from "../product/product.module";
import { BasketModule } from "../basket/basket.module";
import { OrderService } from "./order.service";
import { JwtAuthService } from "../auth/jwt.service";
import { AuthGuard } from "../auth/guard/auth.guard";
import { OrderController } from "./order.controller";
import { UserModule } from "../users/user.module";

@Module(
    {
        imports : [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]), ProductModule, BasketModule, UserModule],
        providers : [OrderService, JwtAuthService, AuthGuard],
        controllers : [OrderController],
        exports : [TypeOrmModule]
    }
)
export class OrderModule {}