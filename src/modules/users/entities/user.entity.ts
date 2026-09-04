import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/names.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, UpdateDateColumn } from "typeorm";
import { UserProfileEntity } from "./user-profile.entity";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";
@Entity(EntityNames.users)
export class UserEntity extends AbstractEntity { 
    @Column({unique : true})
    phone : string
    @Column({nullable : true})
    profileId : number
    @Column({nullable : true})
    basketId : number
    @Column({type : "text", nullable : true})
    hashedRt : string | null
    @CreateDateColumn()
    created_at : Date
    @UpdateDateColumn()
    updated_at : Date
    @OneToOne(() => UserProfileEntity, profile => profile.user, {onDelete : "SET NULL", nullable : true})
    profile : UserProfileEntity
    @ManyToOne(() => BasketEntity, basket => basket.users, {onDelete : "SET NULL", nullable : true})
    basket : BasketEntity
}