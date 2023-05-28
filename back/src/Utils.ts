import dotenv from 'dotenv'
dotenv.config()
namespace Utils {
    export const env = {
        EXPRESS_PORT: parseInt(process.env.EXPRESS_PORT || "3000") ,
    }
}
export default Utils