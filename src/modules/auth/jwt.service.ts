import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccessTkDto, TPayload, VerfiyAccessTkDto } from "./dto/jwt.dto";
import { AuthErrorMessage } from "src/common/messages/auth.message";

@Injectable()
export class JwtAuthService {
    constructor(private jwtService : JwtService) {}
    async signAccessToken(accessTkDto : AccessTkDto) {
        const {secret, payload} = accessTkDto
        const token = await this.jwtService.signAsync(payload, {
            secret,
            expiresIn : process.env.ACCESS_TOKEN_TTL
        })
        return token
    }

    async checkAccessToken(verifyAccessTkDto : VerfiyAccessTkDto) {
        const {token, secret} = verifyAccessTkDto
        const payload : TPayload = await this.jwtService.verifyAsync(token, {secret})
        if(!payload) throw new UnauthorizedException(AuthErrorMessage.tokenInvalid)
        return payload
    }
    async signRefreshToken(accessTkDto : AccessTkDto) {
        const {secret, payload} = accessTkDto
        const token = await this.jwtService.signAsync(payload, {
            secret,
            expiresIn : process.env.REFRESH_TOKEN_TTL
        })
        return token
    }

    async checkRefreshToken(verifyAccessTkDto : VerfiyAccessTkDto) {
        const {token, secret} = verifyAccessTkDto
        const payload : TPayload = await this.jwtService.verifyAsync(token, {secret})
        if(!payload) throw new UnauthorizedException(AuthErrorMessage.tokenInvalid)
        return payload
    }
}