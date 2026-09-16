import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

export class ReqInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        const req = context.switchToHttp().getRequest<Request>()
        console.log(`${req.ip} requested ${req.url}`)
        return next.handle()
    }
}