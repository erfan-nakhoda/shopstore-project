import { BadRequestException } from "@nestjs/common"
import Kavenegar from "kavenegar"
import { AuthErrorMessage } from "../messages/auth.message"
interface SendSmsDto {
    message : string,
    receptor : string,
    sender ?: string
}
export async function SendSms(sendSmsDto : SendSmsDto) {
    const {message, receptor} = sendSmsDto
    const api = Kavenegar.KavenegarApi({
        apiKey : process.env.SMS_API_KEY
    })
    return new Promise((resolve, reject) => {
        api.Send({message , receptor, sender : process.env.SMS_SENDER_NUMBER}, (res,status) => {
        console.log(res)
        if(status != 200) return reject(new BadRequestException(AuthErrorMessage.otpSendProcess))
        return resolve(true)
    })
    }) 
}