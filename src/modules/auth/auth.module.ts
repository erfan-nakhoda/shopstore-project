import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthService } from "./jwt.service";
import { UserModule } from "../users/user.module";
import { CacheRedisModule } from "../cache/cache.module";
import { BasketModule } from "../basket/basket.module";
import { AuthGuard } from "./guard/auth.guard";

@Module({
    imports : [CacheRedisModule, UserModule, JwtModule.register({
        secret : process.env.JWT_SECRET,
        global : true
    }), BasketModule],
    providers : [AuthService, JwtAuthService],
    controllers : [AuthController],
    exports : [AuthService, JwtAuthService]
})
export class AuthModule {}
