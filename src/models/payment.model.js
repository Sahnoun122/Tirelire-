import mongoose, { Schema } from "mongoose";

const paymentSchema = Schema.mongoose({
    group : {type : mongoose.Schema.Types.ObjectId  , ref : "Group" , required : true},
    user : {type : mongoose.Schema.Types.ObjectId , ref : "User" , required : true},
    amount : {type : Number , required : true , min : 0},
    currency : {type : String , default : "MAD"},
    dueDate : {type : Date , required : true},
    paidAt : {type : Date},
    status : {type : String , enum : ["pending","paid","late","missed"] , default : "pending"},
    methode : {type : String , enum : ["cash","stripe","transfer","mobile"] , default : "cash"},
    note : {type : String},


    stripePaymentIntentId : {type : String},
    stripeCustomerId : {type : String},
    stripePaymentMethodId : {type : String},
    stripeStatus : {type : String}
},
  {timestamps : true}
);

export default mongoose.model("Payment" , paymentSchema);

