import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/names.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { UserProfileEntity } from "./user-profile.entity";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";
import { UsersRoles } from "../../rbac/enum/role.enum";
import { RoleEntity } from "../../rbac/entities/role.entity";
import { OrderEntity } from "src/modules/order/entities/order.entity";
@Entity(EntityNames.users)
export class UserEntity extends AbstractEntity { 
    @Column({unique : true})
    phone : string
    @Column({nullable : true})
    profileId : number
    @Column({nullable : true})
    basketId : number
    @Column()
    roleId : number
    @Column({type : "text", nullable : true})
    hashedRt : string | null
    @CreateDateColumn()
    created_at : Date
    @UpdateDateColumn()
    updated_at : Date
    @OneToOne(() => UserProfileEntity, profile => profile.user, {onDelete : "SET NULL", nullable : true})
    profile : UserProfileEntity
    @OneToOne(() => BasketEntity, basket => basket.user, {onDelete : "SET NULL", nullable : true})
    basket : BasketEntity
    @ManyToOne(() => RoleEntity, role => role.users, {onDelete : 'SET NULL'})
    role : RoleEntity
    @OneToMany(() => OrderEntity, order => order.user, {nullable : true})
    orders : OrderEntity[]
}