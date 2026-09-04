import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNumberString, Length } from "class-validator";

export class SendOtpDto {
    @ApiProperty()
    @IsMobilePhone("ir-IR", {}, {message : "phone is wrong"})
    phone : string

}

export class CheckOtpDto {
    @ApiProperty()
    @IsMobilePhone("ir-IR", {}, {message : "phone is wrong"})
    phone : string
    @ApiProperty()
    @IsNumberString()
    @Length(6,6)
    code : string
}