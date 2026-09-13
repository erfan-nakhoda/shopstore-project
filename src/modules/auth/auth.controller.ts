import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CheckOtpDto, SendOtpDto } from "./dto/auth.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { CookieNames } from "src/common/enum/names.enum";
import { AuthSuccessMessage } from "src/common/messages/auth.message";
import { SwaggerConsume } from "src/common/enum/swagger.enum";
import { Auth } from "src/common/decorator/auth.decorator";

@Controller('/auth')
@ApiTags("Authentication")
export class AuthController {
    constructor(private readonly authService : AuthService) {

    }
    @Post('/send-otp')
    @ApiConsumes(SwaggerConsume.json, SwaggerConsume.urlencoded)
    sendOtp(@Body() sendOtpDto : SendOtpDto) {
        return this.authService.sendOtp(sendOtpDto)
    }
    @Post("/check-otp")
    @ApiConsumes(SwaggerConsume.json, SwaggerConsume.urlencoded)
     async checkOtp(@Body() checkOtpDto : CheckOtpDto, @Res() res : Response) {
        const {refreshToken, ...other} = await this.authService.checkOtp(checkOtpDto)
        res.cookie(CookieNames.refreshTk, refreshToken, {
            httpOnly : true,
            secure : process.env.PROJECT_TYPE === "production",
            maxAge : process.env.REFRESH_TOKEN_COOKIE_TTL
        })
        res.status(other.status).json(other)
        
    }
    @Get("/logout")
    @ApiConsumes(SwaggerConsume.json, SwaggerConsume.urlencoded)
    @Auth()
    logOut(@Res({passthrough : true}) res : Response) {
        return this.authService.logOut(res)
        
    }
    @Get("/refresh")
    @ApiConsumes(SwaggerConsume.json, SwaggerConsume.urlencoded)
    async refresh(@Res() res : Response) {
            const {refreshToken, ...other} = await this.authService.refresh()
            res.clearCookie(CookieNames.refreshTk, {
                httpOnly : true,
                secure : process.env.PROJECT_TYPE === "production"
            })
            res.cookie(CookieNames.refreshTk, refreshToken, {
                httpOnly : true,
                secure : process.env.PROJECT_TYPE === "production",
                maxAge : process.env.REFRESH_TOKEN_COOKIE_TTL
            })
            res.status(other.status).json(other)
        }
}