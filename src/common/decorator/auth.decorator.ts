import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guard/auth.guard";

export function Auth () {
    return applyDecorators(
        ApiBearerAuth(),
        UseGuards(AuthGuard)
    )
}