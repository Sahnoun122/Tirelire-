import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connexion à la base de données réussie");
    } catch (error) {
        console.error("❌ Erreur de connexion MongoDB:", error.message);
        process.exit(1);
    }
}

export default connectDB