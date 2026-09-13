import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { DeepPartial, Repository } from "typeorm";
import { categoryErrorMessage, categorySuccessMessage } from "./enum/message.enum";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import slugify from "slugify"
import { createPersianSlug } from "src/common/utility/persianSlugify.utils";
import { ChangeAndMakeOptionalField, ChangeTypeOfField } from "src/common/types/optionalFields.type";

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(CategoryEntity) private categoryRepo: Repository<CategoryEntity>) { }
    async getAll() {
        let categories = await this.categoryRepo.find({ where: {}, relations: { products: true }, select: { products: { name: true } } })
        categories = categories.map(category => Object.assign(category, { count: category.products.length }))
        return {
            status: 200,
            message: categorySuccessMessage.categoryFound,
            data: categories
        }
    }

    async findOneBySlug(slug: string, mustExist: boolean = true) {
        const category = await this.categoryRepo.findOne({ where: { slug }, relations: { products: true } })
        if (!category && mustExist) throw new BadRequestException(categoryErrorMessage.categoryNotFound)
        else if (category && !mustExist) throw new BadRequestException(categoryErrorMessage.categoryFound)
        return category
    }
    async getOneBySlug(slug: string) {
        const category = await this.findOneBySlug(slug)
        return {
            status: 200,
            message: categorySuccessMessage.categoryFound,
            data: category
        }
    }

    async create(createCategoryDto: CreateCategoryDto) {
        let { categoryId, name, slug } = createCategoryDto
        let createObj: ChangeAndMakeOptionalField<CreateCategoryDto, "categoryId", number> = { name, slug }
        slug = await this.validateSlug(slug, name)
        createObj['slug'] = slug
        if (categoryId) {
            const parent = await this.categoryRepo.findOneBy({ id: +categoryId })
            if (!parent) throw new BadRequestException(categoryErrorMessage.categoryNotFoundById)
            createObj['categoryId'] = parent?.id
        }
        await this.categoryRepo.insert(createObj)
        return {
            status: 201,
            message: categorySuccessMessage.categoryCreated
        }
    }
    async updateBySlug(slug: string, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.findOneBySlug(slug)
        await this.updateCategory(category, updateCategoryDto)
        return {
            status: 200,
            message: categorySuccessMessage.categoryUpdated
        }



    }
    async updateById(id: number, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.categoryRepo.findOneBy({ id })
        await this.updateCategory(category, updateCategoryDto)
        return {
            status: 200,
            message: categorySuccessMessage.categoryUpdated
        }
    }
    async deleteBySlug(slug: string) {
        const category = await this.categoryRepo.findOneBy({ slug })
        if (!category) throw new BadRequestException(categoryErrorMessage.categoryNotFound)
        await this.categoryRepo.delete({ slug })
        return {
            status: 200,
            message: categorySuccessMessage.categoryDeleted
        }
    }
    async deleteById(id: number) {
        const category = await this.categoryRepo.findOneBy({ id })
        if (!category) throw new BadRequestException(categoryErrorMessage.categoryNotFound)
        await this.categoryRepo.delete({ id })
        return {
            status: 200,
            message: categorySuccessMessage.categoryDeleted
        }
    }
    async validateSlug(slug: string, name?: string) {
        if (name) {
            if (!slug) slug = createPersianSlug(name)
            else slug = createPersianSlug(slug)
            await this.findOneBySlug(slug, false)
            return slug
        }
        else {
            slug = createPersianSlug(slug)
            await this.findOneBySlug(slug, false)
            return slug
        }
    }

    async updateCategory(category: CategoryEntity | null, updateCategoryDto: UpdateCategoryDto) {
        let { slug: clientSlug, categoryId, name } = updateCategoryDto
        const updateObj: DeepPartial<ChangeTypeOfField<UpdateCategoryDto, "categoryId", number>> = name ? { name } : {}
        if (name && clientSlug) updateObj['slug'] = await this.validateSlug(clientSlug, name)
        else if (clientSlug) updateObj['slug'] = await this.validateSlug(clientSlug)
        if (categoryId) {
            const parent = await this.categoryRepo.findOneBy({ id: +categoryId })
            if (!parent) throw new BadRequestException(categoryErrorMessage.categoryNotFoundById)
            updateObj['categoryId'] = parent?.id
        }

        await this.categoryRepo.update({ id: category?.id }, updateObj)
        return true
    }
}