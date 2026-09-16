import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class CreateOrderItemDto {
    @ApiProperty()
    totalPrice: string
    @ApiPropertyOptional()
    discount_code?: string



}

export interface OrderItem {
    product_name : string,
    productId : number,
    count : number,
    color : string,
    
}