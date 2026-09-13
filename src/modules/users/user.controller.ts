import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "src/common/decorator/auth.decorator";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SwaggerConsume } from "src/common/enum/swagger.enum";

@Controller("/users")
@ApiTags("users")
@ApiConsumes(SwaggerConsume.json, SwaggerConsume.urlencoded)
export class UserController {
    constructor(private readonly userService : UserService){}
    @Get('/me')
    @Auth()
    getMe() {
        return this.userService.me()
    }
}