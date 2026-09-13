import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "./entites/product.entity";
import { DeepPartial, Repository } from "typeorm";
import { productErrorMessage, productSuccessMessage } from "./enum/message.product";
import { BadRequestException } from "@nestjs/common";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { CategoryEntity } from "../categories/entities/category.entity";
import { categoryErrorMessage } from "../categories/enum/message.enum";
import { ChangeAndMakeOptionalField, ChangeAndMakeOptionalFields, ChangeTypeOfField, ChangeTypeOfFields } from "src/common/types/optionalFields.type";
import { PaginationGenerator, PaginationSolver } from "src/common/utility/pagination.utils";


export class ProductService {
    constructor(@InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
        @InjectRepository(CategoryEntity) private categoryRepo: Repository<CategoryEntity>
    ) { }
    async getAll(page : number, limit : number) {
        const {page : newPage, limit : newLimit, skip} = PaginationSolver(page, limit)
        const [products, count] = await this.productRepo.findAndCount({ where: {}, relations : {category : true}, select : {
            category : {
                id : true,
                name : true
            }
        },
        take : newLimit,
        skip
    
    })
        if (!products || count == 0) return { status: 200, message: productErrorMessage.productNotFound }
        return {
            status : 200,
            message : productErrorMessage.productFound,
            pagination : PaginationGenerator(count, newPage, newLimit),
            data : {products}
        }
    }

    async findOneById(id: number) {
        const product = await this.productRepo.findOne({ where: { id } })
        if (!product) throw new BadRequestException(productErrorMessage.productNotFound)
        return product
    }
    async findBycategoryId(categoryId: number) {
        const [products, count] = await this.productRepo.findAndCount({ where: { categoryId } })
        if (!products || count == 0) throw new BadRequestException(productErrorMessage.productNotFound)
        return { products, count }
    }
    async getAllByCategoryId(categoryId: number) {
        const productsWithCount = await this.findBycategoryId(categoryId)
        return {
            status: 200,
            message: productSuccessMessage.productFound,
            data: productsWithCount
        }
    }
    async getOne(id: number) {
        const product = await this.findOneById(id)
        return {
            status: 200,
            message: productSuccessMessage.productFound,
            data: product
        }
    }
    async create(createProductDto: CreateProductDto) {
        const { categoryId, color, image, name, total_count, hex_code, size } = createProductDto
        if (await this.productRepo.findOneBy({ name })) throw new BadRequestException(productErrorMessage.productFound)
        const createObj: ChangeAndMakeOptionalFields<CreateProductDto, { categoryId: number, total_count: number, image: string }> = { color, image: image?.path, name, total_count: +total_count, hex_code, size }
        if (categoryId) {
            const category = await this.categoryRepo.findOne({ where: { id: +categoryId } })
            if (!category) throw new BadRequestException(categoryErrorMessage.categoryNotFound)
            createObj['categoryId'] = category?.id
        }
        if (+total_count <= 0) throw new BadRequestException(productErrorMessage.totalCountInvalid)

        await this.productRepo.insert(createObj)
        return {
            status: 201,
            message: productSuccessMessage.productCreated
        }

    }
    async updateById(id: number, updateProductDto: UpdateProductDto) {
        const { categoryId, color, image, name, total_count } = updateProductDto
        const updateObj: DeepPartial<ChangeTypeOfFields<UpdateProductDto, { categoryId: number, total_count: number, image: string }>> = {}
        if (categoryId) {
            const category = await this.categoryRepo.findOne({ where: { id: +categoryId } })
            if (!category) throw new BadRequestException(categoryErrorMessage.categoryNotFound)
            updateObj['categoryId'] = category?.id
        }
        if (color) updateObj['colors'] = color
        if (image) updateObj['image'] = image.path
        if (name) updateObj['name'] = name
        if (total_count && +total_count > 0) updateObj["total_count"] = +total_count
        await this.productRepo.update({ id }, updateObj)
        return {
            status: 200,
            message: productSuccessMessage.productUpdated
        }
    }
}