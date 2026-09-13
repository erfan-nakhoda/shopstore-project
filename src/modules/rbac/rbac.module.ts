import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "./entities/role.entity";
import { RoleGuard } from "./guard/role.guard";

@Module({
    imports : [TypeOrmModule.forFeature([RoleEntity])],
    providers : [RoleGuard],
    exports : [TypeOrmModule, RoleGuard]
})
export class RBACModule {}