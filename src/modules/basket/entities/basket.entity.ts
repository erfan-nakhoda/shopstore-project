import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/names.enum";
import { ProductEntity } from "src/modules/product/entites/produt.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne } from "typeorm";

@Entity(EntityNames.basket)
export class BasketEntity extends AbstractEntity {
    @Column()
    productId : number
    @Column()
    count : number
    @Column()
    userId : number
    @CreateDateColumn()
    created_at : Date
    @OneToMany(() => UserEntity, user => user.basket)
    users : UserEntity[]
    @OneToMany(() => ProductEntity, product => product.basket)
    products : ProductEntity[]
}