
export type TPayload = {
    userId : number
}
export class AccessTkDto {
    secret : string
    payload  : TPayload
}
export class VerfiyAccessTkDto {
    secret : string
    token  : string
}