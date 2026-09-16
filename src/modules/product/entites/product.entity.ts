import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/names.enum";
import { BasketItemEntity } from "src/modules/basket/entities/basket-item.entity";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";
import { CategoryEntity } from "src/modules/categories/entities/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity(EntityNames.products)
export class ProductEntity extends AbstractEntity {
    @Column({unique : true})
    name : string
    @Column()
    total_count : number
    @Column()
    categoryId : number
    @Column({nullable : true})
    image : string
    @Column({nullable : true})
    price : string
    @Column()
    color : string
    @Column({nullable : true})
    hex_code : string
    @Column({nullable : true})
    size : string
    @OneToMany(() => BasketItemEntity, (basketItem) => basketItem.product, {nullable : true})
    basketItem : BasketItemEntity
    @ManyToOne(() => CategoryEntity, (category) => category.products)
    @JoinColumn({name : "categoryId"})
    category : CategoryEntity
}