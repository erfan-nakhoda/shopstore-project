import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProfileEntity } from "./entities/user-profile.entity";
import { UserEntity } from "./entities/user.entity";
import { RBACModule } from "../rbac/rbac.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtAuthService } from "../auth/jwt.service";

@Module({
    imports : [TypeOrmModule.forFeature([UserEntity, UserProfileEntity]), RBACModule],
    controllers : [UserController],
    providers : [UserService, JwtAuthService],
    exports : [TypeOrmModule, RBACModule]
})
export class UserModule {}