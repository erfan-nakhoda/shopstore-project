import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { Auth } from "src/common/decorator/auth.decorator";
import { Role } from "src/common/decorator/role.decorator";
import { UsersRoles } from "../rbac/enum/role.enum";

@Controller('/category')
export class CategoryController {
    constructor(private readonly categoryService : CategoryService) {}
    @Get("/all")
    getAll() {
        return this.categoryService.getAll()
    }
    @Get("/:slug")
    getOneBySlug(@Param("slug") slug : string) {
        return this.categoryService.findOneBySlug(slug)
    }
    
    @Post("/create")
    @Role(UsersRoles.ADMIN)
    @Auth()
    create(@Body() createCategoryDto : CreateCategoryDto) {
        console.log(createCategoryDto)
        return this.categoryService.create(createCategoryDto)
    }
    @Patch("/update/:slug")
    @Role(UsersRoles.ADMIN)
    @Auth()
    updateBySlug(@Param('slug') slug: string, @Body() updateCategoryDto : UpdateCategoryDto) {
        return this.categoryService.updateBySlug(slug, updateCategoryDto)
    }
    @Patch("/update/:id")
    @Role(UsersRoles.ADMIN)
    @Auth()
    updateById(@Param('id', new ParseIntPipe()) id: number, @Body() updateCategoryDto : UpdateCategoryDto) {
        return this.categoryService.updateById(id, updateCategoryDto)
    }
    @Delete("/delete/:slug")
    @Role(UsersRoles.ADMIN)
    @Auth()
    deleteBySlug(@Param('slug') slug: string) {
        return this.categoryService.deleteBySlug(slug)
    }
    @Delete("/delete/:id")
    @Role(UsersRoles.ADMIN)
    @Auth()
    deleteById(@Param('id', new ParseIntPipe()) id: number) {
        return this.categoryService.deleteById(id)
    }
}