import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";

@Injectable({scope : Scope.REQUEST})
export class UserService {
    constructor(@Inject(REQUEST) private req : Request) {}
    me() {
        const user = this.req.user
        return {
            status : 200,
            message : "user found",
            data : user ? user : {}
        }
        
    }
}