import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/names.enum";
import { ProductEntity } from "src/modules/product/entites/product.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne } from "typeorm";
import { BasketItemEntity } from "./basket-item.entity";

@Entity(EntityNames.basket)
export class BasketEntity extends AbstractEntity {
    @Column()
    userId : number
    @CreateDateColumn()
    created_at : Date
    @OneToOne(() => UserEntity, user => user.basket, {onDelete : "CASCADE"})
    user : UserEntity
    @OneToMany(() => BasketItemEntity, basketItem => basketItem.basket, {nullable : true})
    items : BasketItemEntity[]
    
}