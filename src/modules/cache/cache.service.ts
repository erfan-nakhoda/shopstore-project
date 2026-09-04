import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";
import { randomInt } from "crypto";
import { AuthErrorMessage } from "src/common/messages/auth.message";
import bcrypt from "bcrypt"

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async checkOtpExist(key: string): Promise<string> {
        const code = await this.cacheManager.get<string>(key);
        if (!code) return ""
        return code
    }
    async signOtp(phone: string): Promise<string> {
        const code = randomInt(100000, 999999).toString()
        const salt = bcrypt.genSaltSync()
        const hashCode = await bcrypt.hash(code, salt)
        const otp = await this.checkOtpExist(`otp:user:${phone}`)
        if (otp) throw new BadRequestException(AuthErrorMessage.otpExist)
         await this.cacheManager.set(`otp:user:${phone}`, hashCode, 2 * 60 * 1000)
        return code
    }
}