import mongoose from "mongoose";
import { isLowercase } from "validator";

const MemberSubShema = new mongoose.Schema({
    user_id :{ type : mongoose.Schema.Types.ObjectId , ref : "User" },

    status :{type : String , enum :["active" , "pending" , "left"] , default : "active"},
    joinedAt : { type : Date , default : Date.now}
} , {_id : false });

const UserShema = new mongoose.Schema({
    firstName : {type : String},
    lastNam : {type : String},
     email : {type : String , required : true , unique : true , Lowercase : true },
     passwosrd : {type : String , required : true },
     role : {type : String , enum :[ "particulier" , "admin"], default : "particulier"},
     national_id : String,
     kyc_status : {type : String , enum : ["pending" , "verified" , "rejected"] , default : "pending"},
     photo_id_url : String,
     selfie_url : String,
     reliability_score : {type : Number , default : 0},
     refreshTokens : [{token : String , createdAt : Date}],
     createdAt : {type : Date , default : Date.now }

});

export default mongoose.model("User" , UserShema);