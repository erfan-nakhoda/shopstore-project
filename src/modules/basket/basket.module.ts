import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BasketEntity } from "./entities/basket.entity";
import { BasketController } from "./basket.controller";
import { BasketService } from "./basket.service";
import { ProductModule } from "../product/product.module";
import { UserModule } from "../users/user.module";
import { AuthModule } from "../auth/auth.module";
import { AuthGuard } from "../auth/guard/auth.guard";
import { JwtAuthService } from "../auth/jwt.service";
import { BasketItemEntity } from "./entities/basket-item.entity";

@Module({
    imports : [TypeOrmModule.forFeature([BasketEntity, BasketItemEntity]), ProductModule, UserModule],
    controllers : [BasketController],
    providers : [BasketService, AuthGuard, JwtAuthService],
    exports : [TypeOrmModule, BasketService]
})
export class BasketModule {}
