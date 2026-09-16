import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsNumberString, IsString, Length, Matches } from "class-validator";

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @Length(3, 20)
    name : string
    @ApiProperty()
    @IsNumberString()
    total_count : string
    @ApiProperty()
    // this says that it should start with a word in persian between 3 to 15 characters and after that
    // if you see a group like a comma + word between 3 to 15 characters capture them without caching them in memory.
    // @Matches(/^[آ-یء-ي‌]{3,15}(?:,[آ-یء-ي‌]{3,15})*$/, {message : "format should be somthing like 'سبز,قرمز,آبی,....' "})
    color : string
    @ApiProperty()
    hex_code : string
    @ApiProperty()
    price : string
    @ApiProperty()
    size : string
    @ApiProperty({format : "binary"})
    image ?: Express.Multer.File
    @ApiPropertyOptional()
    @IsNumberString()
    categoryId : string
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}