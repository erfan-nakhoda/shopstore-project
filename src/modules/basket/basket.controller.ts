import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { AddItemsToBasketDto, DeleteFromBasketDto } from "./dto/basket.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SwaggerConsume } from "src/common/enum/swagger.enum";
import { Auth } from "src/common/decorator/auth.decorator";

@Controller('/basket')
@ApiTags('basket')
@ApiConsumes(SwaggerConsume.urlencoded, SwaggerConsume.json)
@Auth()
export class BasketController {
    constructor(private readonly basketService : BasketService) {}
    @Get('/get/:id')
    getById(@Param("id", new ParseIntPipe()) id : number) {
        return this.basketService.getById(id)
    }
    @Post('/add-item')
    addItem(@Body() addItemToBasketDto : AddItemsToBasketDto) {
        return this.basketService.addItemToBasket(addItemToBasketDto)
    }
    @Delete('/delete-item/')
    deleteItem(@Body() deleteFromBasketDto : DeleteFromBasketDto) {
        return this.basketService.deleteItemFromBasket(deleteFromBasketDto)
    }
}