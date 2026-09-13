import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../rbac/entities/role.entity";
import { UserEntity } from "../users/entities/user.entity";
import { BasketService } from "../basket/basket.service";
import { BasketEntity } from "../basket/entities/basket.entity";

@Injectable()
export class UserSeed {
    constructor(@InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(BasketEntity) private basketRepo : Repository<BasketEntity>

    ) { }
    async run() {
        const role = await this.roleRepo.findOneBy({ name: 'ADMIN' })
        if (process.env.SEED_ADMIN_PHONE) {
            if (role && process.env.SEED_ADMIN_PHONE) {
                if (!await this.userRepo.findOneBy({ phone: process.env.SEED_ADMIN_PHONE })) {
                    const user = this.userRepo.create({
                        phone: process.env.SEED_ADMIN_PHONE,
                        roleId: role?.id,

                    })
                    const { id : userId } = await this.userRepo.save(user)
                    const basket = this.basketRepo.create({userId})
                    const {id : basketId} = await this.basketRepo.save(basket)
                    user.basketId = basketId
                    await this.userRepo.save(user)
                    console.log("Admin Created")
                }
            }
        }
    }
}