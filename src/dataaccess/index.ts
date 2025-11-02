import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const initDatabase = async (): Promise<void> => {
    try{
        mongoose.Promise = global.Promise;
        mongoose.set("strictQuery", false);

        const mongoURL = process.env.MONGO_URL as string;

        await mongoose.connect(mongoURL);
        console.log("mongoDB connected successfully....");
    }catch (e){
        console.log("mongoDB connection failed (!)",e);
        process.exit(1);
    }
}