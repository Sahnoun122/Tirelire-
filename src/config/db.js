import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async ()=> {

    try {

        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser : true,
            useUnifiedTopology: true,

        });
        console.log("la connection avec la base de donnes c'est bine ")
        
    } catch (error) {
        console.error("mongodb est non connecter" , error.message);
        process.exit(1);
    }
}

export default connectDB