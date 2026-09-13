import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { Repository } from "typeorm";
import { JwtAuthService } from "src/modules/auth/jwt.service";
import { AuthErrorMessage } from "src/common/messages/auth.message";
import { UserEntity } from "src/modules/users/entities/user.entity";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        private readonly jwtService: JwtAuthService
    ) { }
    async canActivate(context: ExecutionContext) {
        const req: Request = context.switchToHttp().getRequest()
        const { authorization } = req.headers
        if (!authorization || !authorization.trim()) throw new UnauthorizedException(AuthErrorMessage.loginFirst)
        const [bearer, token] = authorization.split(" ")
        if (bearer.toLowerCase() !== "bearer") throw new UnauthorizedException(AuthErrorMessage.loginFirst)
        if (!token) throw new UnauthorizedException(AuthErrorMessage.tokenNotFound)
        const payload = await this.jwtService.checkAccessToken({token, secret : process.env.ACCESS_TOKEN_SECRET})
        const user = await this.userRepo.findOne({
            where: { id: payload.userId},
            relations : {role : true},
            select : {
                role : {
                    name : true,
                    title : true
                }
            }
        })

        if (!user) throw new UnauthorizedException(AuthErrorMessage.userNotFound)
        req.user = user
        return true

    }

}