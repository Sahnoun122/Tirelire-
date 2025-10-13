import mongoose from "mongoose";

const kycSchema  = new mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        require : true,
    },
    fullName : String,
    nationalId :String,
    cardImage : String,
    faceImage : String,
    status : {
        type : String,
        enum : ["pending", "verified", "rejected"],
        default : "pending",
    }
});

export default mongoose.model("kyc" , kycSchema);