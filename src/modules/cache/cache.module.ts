import KeyvRedis, { Keyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";

@Module({
    imports : [CacheModule.registerAsync({
        useFactory : async () => {return {
            stores : [new KeyvRedis(process.env.REDIS_URL, {throwOnConnectError : true})]
        }}
    })],
    providers : [],
    exports : []
})
export class CacheRedisModule {}