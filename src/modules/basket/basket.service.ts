import { BadRequestException, Inject, Injectable, Scope, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BasketEntity } from "./entities/basket.entity";
import { Repository } from "typeorm";
import { BasketErrorMessage, BasketSuccessMessage } from "./enum/message.enum";
import { AddItemsToBasketDto, CreateEmptyBasket, DeleteFromBasketDto } from "./dto/basket.dto";
import { UserEntity } from "../users/entities/user.entity";
import { ProductEntity } from "../product/entites/product.entity";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { BasketItemEntity } from "./entities/basket-item.entity";
import { AuthErrorMessage } from "src/common/messages/auth.message";

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
    constructor(@InjectRepository(BasketEntity) private basketRepo: Repository<BasketEntity>,
        @InjectRepository(BasketItemEntity) private basketItemRepo: Repository<BasketItemEntity>,
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
        @Inject(REQUEST) private req: Request
    ) { }

    async getById(userId: number) {
        const basket = await this.basketRepo.findOne({
            where: { userId }, relations: { items: { product: true } }, select: {
                items: {
                    count: true,
                    productId: true,

                    product: { price: true, name: true }

                }
            }
        })
        if (!basket) return { status: 200, message: BasketErrorMessage.basketNotFound }
        console.log(basket)
        return {
            status: 200,
            message: BasketSuccessMessage.basketFound,
            data: basket
        }
    }
    // its usage is in creating user
    async createEmptyBasket(createBasketDto: CreateEmptyBasket): Promise<BasketEntity> {
        const { userId } = createBasketDto
        let basket = userId ? await this.basketRepo.findOneBy({ userId }) : null
        if (basket) throw new BadRequestException(BasketErrorMessage.basketExist)
        basket = this.basketRepo.create({ userId })
        const result = await this.basketRepo.save(basket)
        return result
    }
    async deleteBasket() {
        const id = this.req.user?.basketId
        await this.basketRepo.delete({ id })
        return true

    }

    async deleteAndNewCreateBasket() {
        const user = this.req?.user
        if (!user) throw new UnauthorizedException(AuthErrorMessage.loginFirst)
        await this.deleteBasket()
        const { id } = await this.createEmptyBasket({ userId: user.id })
        user.basketId = id
        await this.userRepo.save(user)
        return true
    }
    async addItemToBasket(addItemsToBasketDto: AddItemsToBasketDto) {
        const { count, productId } = addItemsToBasketDto
        const user = this.req.user
        const basketId = user?.basketId
        let productItem = await this.basketItemRepo.findOne({ where: { basketId, productId } })
        let newProductItem: boolean = false
        if (!productItem) {
            productItem = this.basketItemRepo.create({ basketId, productId })
            newProductItem = true
        }
        if (count > 10 || productItem?.count >= 10) throw new BadRequestException(BasketErrorMessage.countIsExceeded)
        console.log(typeof productItem.count)
        productItem.count = newProductItem ? count : productItem.count + (+count)
        await this.basketItemRepo.save(productItem)
        return {
            status: 200,
            message: BasketSuccessMessage.itemAdded
        }
    }

    async deleteItemFromBasket(deleteFromBasketDto: DeleteFromBasketDto) {
        const { productId, count } = deleteFromBasketDto
        const basketId = this.req.user?.basketId
        const productItem = await this.basketItemRepo.findOne({ where: { productId, basketId } })
        if (!productItem) throw new BadRequestException(BasketErrorMessage.productNotExist)
        if (count > productItem.count) throw new BadRequestException(BasketErrorMessage.countIsExceeded)
        if (productItem.count <= 1) await this.basketItemRepo.delete({ basketId: productItem.basketId, productId: productItem.productId })
        else {
            productItem.count -= count
            await this.basketItemRepo.save(productItem)
        }
        return {
            status: 200,
            message: BasketSuccessMessage.itemDeleted
        }
    }
}