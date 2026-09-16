import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "src/common/decorator/auth.decorator";
import { Pagination } from "src/common/decorator/pagination.decorator";
import { OrderService } from "./order.service";
import { CreateOrderItemDto } from "./dto/order.dto";

@Controller('/order')
@ApiTags('orders')
export class OrderController {
    constructor(private readonly orderService : OrderService) {}
    @Get('/all')
    @Pagination()
    @Auth()
    getAll(@Query("page", new ParseIntPipe()) page : number, @Query("limit", new ParseIntPipe()) limit : number) {
        return this.orderService.getAll(page,limit)
    }
    @Get('/:id')
    @Auth()
    getOne(@Param("id") id : number) {
        return this.orderService.getOne(id)
    }
    @Post('/set')
    @Auth()
    setOrders(@Body() createOrderItemDto : CreateOrderItemDto) {
        return this.orderService.setOrders(createOrderItemDto)
    }

}