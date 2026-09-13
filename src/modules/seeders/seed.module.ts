import { Module } from "@nestjs/common";
import { UserSeed } from "./user.seed";
import { RoleSeed } from "./role.seed";
import { SeedService } from "./main.seed";
import { UserModule } from "../users/user.module";
import { BasketModule } from "../basket/basket.module";
import { RBACModule } from "../rbac/rbac.module";

@Module({
    imports : [BasketModule, UserModule, RBACModule],
    providers : [UserSeed, RoleSeed, SeedService]
})
export class SeedModule {}
