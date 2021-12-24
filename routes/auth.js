const express = require("express");
const User = require("../models/User");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const sendEmail  = require("../config/sendMail");
const verifyToken = require("../middleware/verifyToken");



//Route Get api/auth
//Description: Check if user is logged in
//Access: Public

//Route Post api/auth/login
//Description: Login user
//Access Public

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
        res.json({success: true, user: newUser, accessToken: accessToken, message: "Register succesfully, please confirm your email"});
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


router.get("/", verifyToken, async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user){
            return res.status(400).json({success: false, message: "User not found"});
        }
        return res.json({sucess: true, user:user});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
})

module.exports = router;