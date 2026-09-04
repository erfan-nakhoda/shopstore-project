import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthService } from "./jwt.service";
import { UserModule } from "../users/user.module";
import { CacheRedisModule } from "../cache/cache.module";

@Module({
    imports : [CacheRedisModule, UserModule, JwtModule.register({
        secret : process.env.JWT_SECRET,
        global : true
    })],
    providers : [AuthService, JwtAuthService],
    controllers : [AuthController],
    exports : [AuthService, JwtAuthService]
})
export class AuthModule {}