import Kavenegar from "kavenegar"
interface SendSmsDto {
    message : string,
    receptor : string,
    sender ?: string
}
export function SendSms(sendSmsDto : SendSmsDto) {
    const {message, sender} = sendSmsDto
    const api = Kavenegar.KavenegarApi({
        apiKey : '73332F4C2F57796231383843506768626F69547741325A2B4361434543514D68506B546238682B646F58633D'
    })

    api.Send({message , sender}, (res,status) => {
        console.log(status)
        console.log(res)
    })
    return true
}