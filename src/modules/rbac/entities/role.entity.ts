import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/names.enum";
import { Column, CreateDateColumn, Entity, OneToMany } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity(EntityNames.roles)
export class RoleEntity extends AbstractEntity {
    @Column({unique : true})
    name : string
    @Column()
    title : string
    @CreateDateColumn()
    created_at : Date
    @OneToMany(() => UserEntity, user => user.role, {nullable : true})
    users : UserEntity[]
}