const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        required: [true, "Please add your name"],
        trim: true,
        maxLength:[20, "Your name is up to 20 chars long."]
    },
    account:{
        type:String,
        required: [true, "Please add your email"],
        trim: true,
        unique: true,
    },

    password:{
        type:String,
        required: [true, "Please add your password"],
        trim:true,
    },
    avatar:{
        type:String,
        default: 'https://i.pinimg.com/736x/70/ed/2c/70ed2cfc995c583bf2edf229631bb86b.jpg'
    },
    verify:{
        type: Boolean,
        default: false,
    }
},{
    timestamps:true
})

module.exports = mongoose.model("users", UserSchema);