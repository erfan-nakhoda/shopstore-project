import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Auth } from "src/common/decorator/auth.decorator";
import { Role } from "src/common/decorator/role.decorator";
import { CreateProductDto } from "./dto/product.dto";
import { ApiQuery } from "@nestjs/swagger";
import { Pagination } from "src/common/decorator/pagination.decorator";

@Controller('/product')
export class ProductController {
    constructor(private readonly productService : ProductService) {}

    @Get('/all')
    @Pagination()
    getAll(@Query("page", new ParseIntPipe()) page : number, @Query("limit", new ParseIntPipe()) limit : number) {
        return this.productService.getAll(page, limit)
    }
    @Get('/get/:id')
    getOne(@Param("id", new ParseIntPipe()) id : number) {
        return this.productService.getOne(id)
    }
    @Get('/all/:categoryId')
    getAllByCategoryId(@Param("categoryId", new ParseIntPipe()) categoryId : number) {
        return this.productService.getAllByCategoryId(categoryId)
    }
    
    @Post('/create')
    @Role('ADMIN', "SUPPORT")
    @Auth()
    create(@Body() createProductDto : CreateProductDto) {
        return this.productService.create(createProductDto)
    }

}