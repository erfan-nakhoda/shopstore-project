import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export function Pagination() {
    return applyDecorators(
        ApiQuery({name : "page", default : 1}),
        ApiQuery({name : "limit", default : 10}),
    )
}