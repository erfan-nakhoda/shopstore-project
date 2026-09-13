import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../rbac/entities/role.entity";

@Injectable()
export class RoleSeed {
    constructor(@InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>) { }
    async run() {
        const ROLES = [
            { name: "ADMIN", title: "مدیر" },
            { name: "SUPPORT", title: "پشتیبان" },
            { name: "CUSTOMER", title: "کاربر" },
        ]
        for (const role of ROLES) {
            if (!await this.roleRepo.findOneBy(role)) await this.roleRepo.insert(role)
        }
        console.log("Role Inserted Into DB.")
    }
}