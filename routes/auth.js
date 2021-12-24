const express = require("express");
const User = require("../models/User");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const sendEmail  = require("../config/sendMail");



//Route Get api/auth
//Description: Check if user is logged in
//Access: Public

//Route Post api/auth/login
//Description: Login user
// //Access Public
// "name":"bao gia",
//         "account":"knabao7a7@gmail.com",
//         "password" : "abcdef"

router.post('/login',async (req,res)=> { 
    const {account,password} = req.body
    try{

        const user = await User.findOne({account : account})
        
        if (!user)
        res.status(400).json({success:false, message : "Email doesnt exit"})
        else{
            const comparePassword =  await argon2.verify(user.password,password)
            if (!comparePassword)
                res.status(400).json({success: false,message : "Wrong password"})
        }
        //success
        res.status(200).json({success : true, message : "Successfully"})
    }
    catch(err){
        res.status(500).json(err)
    }
})
//Route Put api/auth
//Description: Modify user's information
//Access: private

//Route Post api/auth/register
//Description: Register user
//Access Public

router.post('/register', async(req,res)=>{
    console.log(req.body);

    const {name, account, password} = req.body;

    try {
        const user = await User.findOne({account: account});
        if (user){
            return res.status(400).json({success: false, message: "Email already exists"});
        }
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({name,account, password: hashedPassword});
        await newUser.save();

        //return token
        const accessToken = jwt.sign(
            {
                userId: newUser._id,
                name: newUser.name,
                account: newUser.account,
                avatar: newUser.avatar,
                password: newUser.password,
            },
            process.env.ACCESS_TOKEN_SECRET
        );
        res.json({success: true, user: newUser, message: "Register succesfully, please confirm your email"});
        await sendEmail(account, accessToken);
    } catch (error) {
        console.log(error);
    }
})


//Route get api/auth/verify/:id
//Description: Verify email
//Access Public
router.get("/verify/:id", async(req,res)=>{
    const token = req.params.id;
    console.log(token);
    try {
        let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded.name);
        let updatedUser = {
            name: decoded.name,
            account: decoded.account,
            password: decoded.password,
            avatar: decoded.avatar,
            verify: true,
        }
        console.log(updatedUser);
        const updatedUserCondition = {account: decoded.account};
        updatedUser = await User.findOneAndReplace(
            updatedUserCondition,
            updatedUser,
            {new: false},
        );
        res.json({success: true, user: updatedUser});

    } catch (error) {
        console.log(error.message);
    }
})


module.exports = router;