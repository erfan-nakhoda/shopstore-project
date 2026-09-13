import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/names.enum";
import { ProductEntity } from "src/modules/product/entites/product.entity";
import { Column, CreateDateColumn, Entity, OneToMany } from "typeorm";

@Entity(EntityNames.category)
export class CategoryEntity extends AbstractEntity {
    @Column({unique : true})
    slug : string
    @Column()
    name : string
    @CreateDateColumn()
    created_at : Date
    @OneToMany(() => ProductEntity, (product) => product.category)
    products : ProductEntity[]
}