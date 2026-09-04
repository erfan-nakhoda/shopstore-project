import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProfileEntity } from "./entities/user-profile.entity";
import { UserEntity } from "./entities/user.entity";

@Module({
    imports : [TypeOrmModule.forFeature([UserEntity, UserProfileEntity])],
    exports : [TypeOrmModule]
})
export class UserModule {}