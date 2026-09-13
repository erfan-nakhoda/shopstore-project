import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { UserModule } from "../users/user.module";
import { AuthGuard } from "../auth/guard/auth.guard";
import { JwtAuthService } from "../auth/jwt.service";

@Module({
    imports : [TypeOrmModule.forFeature([CategoryEntity]), UserModule],
    providers : [CategoryService, AuthGuard, JwtAuthService],
    controllers : [CategoryController],
    exports : [TypeOrmModule]
})
export class CategoryModule {}
