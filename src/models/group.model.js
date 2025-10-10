import mongoose from "mongoose";

const MemberShema = new mongoose.Schema({
      user : {type : mongoose.Schema.Types.ObjectId , ref : "User" , required : true},
      status : {type : String, enum : ["active","pending","left","banned"] , default : "active"},
      joindAt : {type : Date , default : Date.now},
      order : {type : Number , default : 0},
}, {_id: false});


const ContributionSubSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId , ref : "User"},
    amount : Number ,
    date : Date,
} , {_id : false});

const RoundShema = new mongoose.Schema({
    roundNumber : {type : Number , required : true},
    beneficiary : {type : mongoose.Schema.Types.ObjectId , ref : "User"},
    status : {type : String , enum : ["pending","active","completed"] , default : "pending"},
    startDate : Date,
    endDate : Date,
    totalCollected : {type : Number , default : 0},
    contributions : [ContributionSubSchema]
} , {_id : false});

const GroupShem = new mongoose.Schema({
    name : {type : String , required : true},
    description : {type : String},
    creator : {type : mongoose.Schema.Types.ObjectId , ref : "User" , required : true},
    memebers : [memebers],
    contributionAmount : {type : Number , required : true },
    frequency : {type : String , enum :["weekly","monthly","yearly"] , default : "monthly"},
    currentRound : {type : Number , default : 0},
    maxRounds : {type : Number , default : 0},
    rounds : [RoundShema],
    isOpen : {type : Boolean , default : true},
    createdAt : {type : Date , default : Date.now}
});

export default mongoose.model("Group" , GroupShem);