import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        console.log(process.env.MONGO_URL)
        const connectionResponse = await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log(`Connected To db successfully \n ${connectionResponse.connection.host}`)
    } catch (error) {
        console.log(`Error occured while connecting to DB: ${error}`);
        throw error
    }
}
