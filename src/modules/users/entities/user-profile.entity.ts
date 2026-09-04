import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/names.enum";
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.profile)
export class UserProfileEntity extends AbstractEntity {
    @Column()
    first_name : string
    @Column()
    last_name : string
    @Column()
    province : string
    @Column()
    city : string
    @Column()
    address : string
    @Column()
    postal_code : string
    @CreateDateColumn()
    created_at : Date
    @UpdateDateColumn()
    updated_at : Date
    @Column()
    userId : number
    @OneToOne(() => UserEntity, user => user.profile, {onDelete : "CASCADE"})
    user : UserEntity
    
    
}