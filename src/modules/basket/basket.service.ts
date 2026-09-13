import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BasketEntity } from "./entities/basket.entity";
import { Repository } from "typeorm";
import { BasketErrorMessage, BasketSuccessMessage } from "./enum/message.enum";
import { AddItemsToBasketDto, CreateEmptyBasket, DeleteFromBasketDto } from "./dto/basket.dto";
import { UserEntity } from "../users/entities/user.entity";
import { ProductEntity } from "../product/entites/product.entity";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
    constructor(@InjectRepository(BasketEntity) private basketRepo: Repository<BasketEntity>,
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
        @Inject(REQUEST) private req: Request
    ) { }

    async getById(userId: number) {
        const basket = await this.basketRepo.findOne({ where: { userId } })
        if (!basket) return { status: 200, message: BasketErrorMessage.basketNotFound }
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
        await this.basketRepo.save(basket)
        return basket
    }
    async addItemToBasket(addItemsToBasketDto: AddItemsToBasketDto) {
        const { count, productId } = addItemsToBasketDto
        let { productItem, user } = await this.findProductFromBasket(productId)
        if (count > 10) throw new BadRequestException(BasketErrorMessage.countIsExceeded)
        if (!productItem) productItem = this.basketRepo.create({ userId: user?.id, productId })
        productItem.count = productItem.count ? productItem.count + count : count
        this.basketRepo.save(productItem)
        return {
            status: 200,
            message: BasketSuccessMessage.itemAdded
        }
    }

    async deleteItemFromBasket(deleteFromBasketDto: DeleteFromBasketDto) {
        let { productId, count } = deleteFromBasketDto
        productId = +productId
        count = +count
        const { productItem, user } = await this.findProductFromBasket(productId)
        if (!productItem) throw new BadRequestException(BasketErrorMessage.productNotExist)
        if (count > productItem.count) throw new BadRequestException(BasketErrorMessage.countIsExceeded)
        if (productItem.count <= 1) await this.basketRepo.delete({userId : productItem.userId, productId : productItem.productId})
        productItem.count -= count
        await this.basketRepo.save(productItem)
        return {
            status: 200,
            message: BasketSuccessMessage.itemDeleted
        }
    }

    async findProductFromBasket(productId: number) {
        const { user } = this.req
        const product = await this.productRepo.findOneBy({ id: productId })
        if (!product) throw new BadRequestException(BasketErrorMessage.productNotExist)
        const basket = user ? await this.basketRepo.find({ where: { userId: user.id } }) : null
        if (!basket) throw new BadRequestException(BasketErrorMessage.basketNotFound)
        let productItem: BasketEntity | undefined = basket.find(item => item.productId == productId)
        return { productItem, user }
    }
}