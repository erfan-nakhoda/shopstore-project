import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/names.enum";
import { ProductEntity } from "src/modules/product/entites/product.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany } from "typeorm";

@Entity(EntityNames.basket)
export class BasketEntity extends AbstractEntity {
    @Column({nullable : true})
    productId : number
    @Column({nullable : true})
    count : number
    @Column()
    userId : number
    @CreateDateColumn()
    created_at : Date
    @OneToMany(() => UserEntity, user => user.basket, {onDelete : "CASCADE"})
    users : UserEntity[]
    @OneToMany(() => ProductEntity, product => product.basket, {nullable : true})
    products : ProductEntity[]
}