import "reflect-metadata"
import { RoleSeed } from "./role.seed";
import { UserSeed } from "./user.seed";
import { Injectable, OnModuleInit } from "@nestjs/common";
@Injectable()
export class SeedService implements OnModuleInit {
        constructor(
                private readonly roleSeed: RoleSeed,
                private readonly userSeed: UserSeed,) { }

        onModuleInit() {
                return Promise.all([this.roleSeed.run(),
                this.userSeed.run()])
        }
}