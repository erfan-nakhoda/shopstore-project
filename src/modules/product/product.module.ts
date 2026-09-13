import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./entites/product.entity";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { CategoryModule } from "../categories/category.module";
import { UserModule } from "../users/user.module";
import { AuthGuard } from "../auth/guard/auth.guard";
import { JwtAuthService } from "../auth/jwt.service";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity]), CategoryModule, UserModule],
    providers: [ProductService, AuthGuard, JwtAuthService
    ],
    controllers: [ProductController],
    exports: [TypeOrmModule, ProductService]
})

export class ProductModule { }
