import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class AddItemsToBasketDto {
    @ApiProperty()
    @IsNumberString()
    productId : number
    @ApiProperty()
    @IsNumberString()
    count : number



}

export class CreateEmptyBasket {
    userId : number
    
}

export class DeleteFromBasketDto {
    @ApiProperty()
    @IsNumberString()
    productId : number
    @ApiProperty()
    @IsNumberString()
    count : number
}