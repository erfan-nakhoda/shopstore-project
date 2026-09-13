import KeyvRedis, { Keyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { CacheService } from "./cache.service";

@Module({
    imports : [CacheModule.registerAsync({
        useFactory : async () => {return {
            stores : [new KeyvRedis(process.env.REDIS_URL, {throwOnConnectError : true})]
        }}
    })],
    providers : [CacheService],
    exports : [CacheService]
})
export class CacheRedisModule {}