const express = require("express");
const router = express.router();
const verifyToken = require("../middleware/verifyToken");
const Novel = require("../models/Novel");



//Route Post api/novels
//Description: Create new novel
//Access Private
router.post("/", verifyToken, async(req,res) => {
    const {novelName, author, thumbnail}  = req.body;
    
    //Check if the request is valid 
    if (!novelName || !author || !thumbnail)
        return res.status(400).json({success: false, message: "You're missing something"});

    try {
        const newNovel =  new Novel({
            novelName,
            author,
            thumbnail,
        })

        await newNovel.save();
        res.json({success: true, message: "You've created new novel successfully", novel: newNovel});
    } catch (error) {
        console.log(erorr);
        res.status(500).json({success: false, message: "Internal server error"});
    }
});

