import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsNumberString, IsString, Length } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    @Length(3, 20)
    name : string
    @ApiProperty()
    @IsString()
    slug : string
    @ApiPropertyOptional()
    categoryId ?: string
}
export class UpdateCategoryDto extends PartialType(CreateCategoryDto){}