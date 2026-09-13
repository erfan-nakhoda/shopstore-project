import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { ROLE_KEY } from "src/common/decorator/role.decorator";
import { RBACErrorMessage } from "../enum/message.enum";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>()
        const requiredRole = this.reflector.getAllAndOverride<string>(ROLE_KEY, [context.getHandler(), context.getClass()])
        if (!requiredRole || requiredRole.length == 0) return true
        const user = req.user
        const userRole = user?.role?.name
        if (!userRole || !requiredRole.includes(userRole)) throw new ForbiddenException(RBACErrorMessage.forbidden)
        return true
    }

}