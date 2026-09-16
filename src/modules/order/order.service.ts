import { BadRequestException, Inject, Injectable, Scope, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { DataSource, Repository } from "typeorm";
import { OrderItemEntity } from "./entities/order-item.entity";
import { BasketService } from "../basket/basket.service";
import { PaginationGenerator, PaginationSolver } from "src/common/utility/pagination.utils";
import { OrderErrorMessage, OrderSuccessMessage } from "./enum/message.enum";
import { CreateOrderItemDto, OrderItem } from "./dto/order.dto";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { ProductEntity } from "../product/entites/product.entity";
import { BasketEntity } from "../basket/entities/basket.entity";
import { AuthErrorMessage } from "src/common/messages/auth.message";
import { BasketErrorMessage } from "../basket/enum/message.enum";

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
    constructor(@InjectRepository(OrderEntity) private orderRepo: Repository<OrderEntity>,
        @InjectRepository(OrderItemEntity) private orderItemRepo: Repository<OrderItemEntity>,
        @InjectRepository(BasketEntity) private basketRepo: Repository<BasketEntity>,
        @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
        @Inject(REQUEST) private req: Request,
        private dataSource: DataSource
    ) { }

    async getAll(page: number, limit: number) {
        const { page: newPage, limit: newLimit, skip } = PaginationSolver(page, limit)
        const [orders, count] = await this.orderRepo.findAndCount({ where: {}, take: newLimit, skip, order: { id: 'DESC' } })
        if (!orders || count == 0) return { status: 200, message: OrderErrorMessage.orderNotFound, data: [] }
        return {
            status: 200,
            message: OrderSuccessMessage.orderFound,
            pagination: PaginationGenerator(count, newPage, newLimit),
            data: orders
        }
    }

    async getOne(orderId: number) {
        const orderItems = await this.orderItemRepo.find({ where: { orderId } })
        if (!orderItems) throw new BadRequestException(OrderErrorMessage.orderNotFound)
        return {
            status: 200,
            message: OrderSuccessMessage.orderFound,
            data: orderItems
        }
    }

    async setOrders(createOrderDto: CreateOrderItemDto) {
        const userId = this.req.user?.id
        if (!userId) throw new UnauthorizedException(AuthErrorMessage.loginFirst)
        const userBasket = await this.basketRepo.findOne({
            where: { userId }, relations: { items: true }, select: {
                items: {
                    productId: true,
                    count: true,
                    product: {
                        name: true,
                        total_count: true,
                        color: true,
                        price: true
                    }
                }
            }
        })
        console.log(userBasket)
        if (!userBasket) throw new BadRequestException(BasketErrorMessage.basketNotFound)
        if (!userBasket.items.length) throw new BadRequestException(OrderErrorMessage.itemsNotFound)

        let totalPrice = 0
        for (const item of userBasket.items) {
            totalPrice += (+item.product.price * item.count)
        }
        await this.ACIDProcessOrderItem(userId, totalPrice, userBasket)
        return {
            status: 201,
            message: OrderSuccessMessage.orderCreated
        }
    }
    async ACIDProcessOrderItem(userId: number, totalPrice: number, userBasket: BasketEntity) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // الف) ساخت یا یافتن Order داخل Transaction
            let order = await queryRunner.manager.findOne(OrderEntity, { where: { userId } });
            if (!order) {
                order = queryRunner.manager.create(OrderEntity, { userId, totalPrice: totalPrice.toString() });
                order = await queryRunner.manager.save(OrderEntity, order);
            } else {
                order.totalPrice = totalPrice.toString();
                await queryRunner.manager.save(OrderEntity, order);
            }

            // ب) آماده‌سازی آیتم‌های سفارش
            const orderItemsEntities = userBasket.items.map(item => {
                return queryRunner.manager.create(OrderItemEntity, {
                    orderId: order.id,
                    productId: item.productId,
                    count: item.count,
                    product_name: item.product.name,
                    color: item.product.color,
                });
            });

            // ج) کاهش موجودی محصولات به صورت Atomic و با چک کردن عدم اتمام موجودی
            for (const item of userBasket.items) {
                const res = await queryRunner.manager
                    .createQueryBuilder()
                    .update(ProductEntity)
                    .set({ total_count: () => `total_count - :qty` })
                    .where("id = :productId", { productId: item.productId })
                    .andWhere("total_count >= :qty", { qty: item.count }) // ✅ حتما بزرگتر مساوی
                    .execute();

                if (res.affected !== 1) {
                    throw new BadRequestException(`محصول ${item.product.name} موجودی کافی ندارد.`);
                }
            }

            // د) ثبت آیتم‌های سفارش
            await queryRunner.manager.insert(OrderItemEntity, orderItemsEntities);

            // هـ) خالی کردن سبد خرید (حذف آیتم‌ها یا ریست سبد)
            await queryRunner.manager.delete(BasketEntity, { userId });
            await queryRunner.manager.save(BasketEntity, queryRunner.manager.create(BasketEntity, { userId }));

            // و) تأیید نهایی
            await queryRunner.commitTransaction();

            return {
                status: 201,
                message: OrderSuccessMessage.orderCreated,
            };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(`acid order error`)
            throw err; // ✅ خطا حتما باید throw بشه تا Nest بفهمه و به فرانت ریسپانس ارور بده
        } finally {
            await queryRunner.release();
        }
    }

    async updateOrderItem() { }
    async delete() { }


}