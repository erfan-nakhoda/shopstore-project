export enum AuthErrorMessage {
    otpExist = "otp is not expired.",
    otpExpired = "otp is expired please try again.",
    otpInvalid = "code is invalid",
    otpExpiredOrPhoneWrong = "otp is expired or phone is wrong please try again",
    tokenInvalid = "token is invalid",
    tokenNotFound = "token not found",
    userNotFound = "user not found",
    loginFirst = "login to your account",
    national_codeExist = "national code is not available",
    emailExist = "email is not available",
    roleNotExist = "role not exist"
}
export enum AuthSuccessMessage {
    otpSent = "otp has sent successfully",
    login = "you are logged in successfully",
    logout = "you are logged out successfully"
}