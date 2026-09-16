import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/names.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BasketEntity } from "./basket.entity";
import { ProductEntity } from "src/modules/product/entites/product.entity";

@Entity(EntityNames.basketItem)
export class BasketItemEntity extends AbstractEntity {
    @Column()
    productId: number
    @Column()
    basketId: number
    @Column()
    count: number
    @CreateDateColumn()
    created_at: Date
    @ManyToOne(() => BasketEntity, basket => basket.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "basketId" })
    basket: BasketEntity
    @ManyToOne(() => ProductEntity, product => product.basketItem, { onDelete: "CASCADE" })
    @JoinColumn({ name: "productId" })
    product: ProductEntity

}