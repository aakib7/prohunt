const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name:{
        type: String,
        required :[true,"Please Enter a Name"]
    },
    email:{
        type: String,
        required :[true,"Please Enter a Name"],
        unique : [true,"Email already exists"]
    },
    avatar:{
        public_id: String,
        url: String
    },
    password:{
        type: String,
        required :[true,"Please Enter a Password"],
        minLength:[6,"Password must be at least 6 characters"],
        select: false, // not select on select query
    },
    gigs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Gig",
        }
    ],
    jobs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Job",
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
module.exports = mongoose.model("User", userSchema);