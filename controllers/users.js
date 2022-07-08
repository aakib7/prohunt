const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("config");

exports.register = async (req,res) =>{
    try{
        let {userName,email,password,firstName,lastName,country} = req.body;
        let user = await User.findOne({userName});

        if(user){
            return res.status(400).json({
                success:false,message:"User name already Taken"});
        }

        let user1 = await User.findOne({email});
        if (user1){
            return res.status(400).json({
                success:false,message:"User already exist with this email"});
        }

        else
        {
            let salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password,salt);
            user = await User.create({userName,email,password,firstName,lastName,
                country,avatar:{public_id:"sample_id",url:"sample_url"}});
             // user will automatacally login after registration

             const token = jwt.sign(
                {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                },
                config.get('jwtPrivateKey')
            );

            return res.status(200).cookie("token",token,{
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly: true
                }).json({
                success:true,
                user,
                token,});
    
        }


    }
    catch(error){
        res.status(500).json(
            {
                success: false,
                message: error.message,
            });
    }
}



// Logout 

exports.logout = async (req,res) => {
    try{
        return res.status(200).cookie("token",null,{ 
            expires : new Date(Date.now()),
            httpOnly : true
        }).json({
            success : true,
            message : "User logged Out"
        });
    }catch(error) {
        res.status(500).json(
            {
                success: false,
                message: error.message,
            });
    }
}

exports.getUsers = (req,res)=>{
    try{
        return res.status(200).json({
            success:true,
            name:"aa1ib",
        });
    }
    catch(error){
        res.status(500).json(
            {
                success: false,
                message: error.message,
            });
    }
}