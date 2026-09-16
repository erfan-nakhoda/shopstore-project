import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { OrderStatus } from "../enum/status.enum";
import { OrderItemEntity } from "./order-item.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { EntityNames } from "src/common/enum/names.enum";

@Entity(EntityNames.orders)
export class OrderEntity extends AbstractEntity {
    @Column()
    totalPrice: string
    @Column()
    userId: number
    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.CONFIRMED
    })
    status: OrderStatus
    @OneToMany(() => OrderItemEntity, orderItem => orderItem.order, {nullable : true})
    items: OrderItemEntity[]
    @ManyToOne(() => UserEntity, user => user.orders, {
        onDelete: 'RESTRICT'
    })
    user: UserEntity

}