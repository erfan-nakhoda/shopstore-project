import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { OrderEntity } from "./order.entity";
import { EntityNames } from "src/common/enum/names.enum";

@Entity(EntityNames.orderItems)
export class OrderItemEntity extends AbstractEntity {
    @Column()
    productId : number
    @Column()
    count : number
    @Column()
    product_name : string
    @Column()
    color : string
    @Column()
    orderId : number
    @ManyToOne(() => OrderEntity, order => order.items, {onDelete : "CASCADE"})
    order : OrderEntity
    @CreateDateColumn()
    created_at : Date
}