import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";
import { Column, ManyToOne } from "typeorm";

export class ProductEntity extends AbstractEntity {
    @Column({unique : true})
    name : string
    @Column()
    total_count : number
    @Column()
    categoryId : number
    @Column()
    basketId : number
    @ManyToOne(() => BasketEntity, basket => basket.products)
    basket : BasketEntity
}