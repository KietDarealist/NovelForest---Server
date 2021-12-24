const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NovelSchema = new Schema({
    novelName: {
        type: String,
        required: true,
        unique: true,
    },
    author: {
        type: String,
        required: true,
    },
    thumbnail:{
        type: String,
        required: true,
    },
    images:{
        type: [String],
        required: false,
    },
    chapters: {
        type: [{key: Number, title: String}],
    },
    views: {
        type: Number,
    },
    comments: {
        type: [{user: {type: Schema.Types.ObjectId, ref: "users"}, content: String}],
    },
    rate: {
        type: Number,
    }
})

module.exports = mongoose.model("novels", NovelSchema);