import { BadRequestException, Inject, Injectable, Res, Scope, UnauthorizedException } from "@nestjs/common";
import { CheckOtpDto, SendOtpDto } from "./dto/auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthErrorMessage, AuthSuccessMessage } from "src/common/messages/auth.message";
import bcrypt from "bcrypt"
import { JwtAuthService } from "./jwt.service";
import { UserEntity } from "../users/entities/user.entity";
import { CacheService } from "../cache/cache.service";
import { REQUEST } from "@nestjs/core";
import type { Request, Response } from "express";
import { CookieNames } from "src/common/enum/names.enum";
import { TPayload } from "./dto/jwt.dto";

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        private readonly cacheService: CacheService,
        private readonly jwtService: JwtAuthService,
        @Inject(REQUEST) private req: Request
    ) { }
    async sendOtp(sendOtpDto: SendOtpDto) {
        const { phone } = sendOtpDto
        const user = await this.userRepo.findOneBy({ phone })
        let code: string
        if (!user) {
            await this.userRepo.insert({ phone })
        }
        code = await this.cacheService.signOtp(phone)
        return {
            status: 200,
            message: AuthSuccessMessage.otpSent,
            code
        }
    }

    async checkOtp(checkOtpDto: CheckOtpDto) {
        const { code, phone } = checkOtpDto
        const user = await this.userRepo.findOne({ where: { phone } })
        if (!user) throw new UnauthorizedException(AuthErrorMessage.userNotFound)
        const codeSent = await this.cacheService.checkOtpExist(`otp:user:${phone}`)
        if (!codeSent) throw new BadRequestException(AuthErrorMessage.otpExpiredOrPhoneWrong)
        if (!bcrypt.compareSync(code, codeSent)) throw new BadRequestException(AuthErrorMessage.otpInvalid)
        const accessToken = await this.jwtService.signAccessToken({ secret: process.env.ACCESS_TOKEN_SECRET, payload: { userId: user?.id } })
        const refreshToken = await this.jwtService.signAccessToken({ secret: process.env.REFRESH_TOKEN_SECRET, payload: { userId: user?.id } })
        user.hashedRt = await bcrypt.hash(refreshToken, 10)
        await this.userRepo.save(user)
        return {
            status: 200,
            message: AuthSuccessMessage.login,
            accessToken,
            refreshToken
        }
    }

    async logOut(@Res({passthrough : true}) res : Response) {
        const {user} = await this.validateRefreshTkAndGetUser()
        user.hashedRt = null
        await this.userRepo.save(user)
        res.clearCookie(CookieNames.refreshTk, {httpOnly : true, secure : process.env.PROJECT_TYPE === "production"})
        return {
            status : 200,
            message : AuthSuccessMessage.logout
        }
    }

    async refresh() {
        let {refreshToken, user} = await this.validateRefreshTkAndGetUser()
        refreshToken = await this.jwtService.signRefreshToken({secret : process.env.REFRESH_TOKEN_SECRET, payload : {userId : user?.id}})
        const accessToken = await this.jwtService.signAccessToken({secret : process.env.ACCESS_TOKEN_SECRET, payload : {userId : user?.id}})
        user.hashedRt = await bcrypt.hash(refreshToken, 10)
        return {
            status : 200,
            accessToken,
            refreshToken
        }
    }

    async getUserIdFromCookie() {
        let refreshToken = this.req.cookies[CookieNames.refreshTk]
        if (!refreshToken) throw new BadRequestException(AuthErrorMessage.loginFirst)
        const { userId } = await this.jwtService.checkRefreshToken({ secret: process.env.REFRESH_TOKEN_SECRET, token: refreshToken })
        return {refreshToken,userId}
    }

    async validateRefreshTkAndGetUser() {
        let {refreshToken,userId} = await this.getUserIdFromCookie()
        const user = await this.userRepo.findOneBy({ id: userId })
        if (!user) throw new BadRequestException(AuthErrorMessage.userNotFound)
        if (!bcrypt.compareSync(refreshToken, user.hashedRt)) throw new BadRequestException(AuthErrorMessage.loginFirst)
        return {refreshToken, user}
        }
}