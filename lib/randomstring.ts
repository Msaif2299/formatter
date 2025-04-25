import { FunctionParameters, randomInteger } from "./common"

export const generateRandomString = (params: FunctionParameters): string => {
    if(params.length === undefined || params.length == 0) {
        throw new Error("Length is required")
    }
    if(params.length > 1000) {
        throw new Error("Length must be less than 1000")
    }
    if(params.length < 0) {
        throw new Error("Length must be greater than 0")
    }
    // check if length is a decimal number
    if(params.length % 1 !== 0) {
        throw new Error("Length must be an integer")
    }
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_"
    let result = ""
    for(let i = 0; i < params.length; i++) {
        result += characters[randomInteger(0, characters.length-1)]
    }
    return result
}