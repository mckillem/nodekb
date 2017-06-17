const mongoose = require("mongoose");

// article schema
const ArticleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    worker: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

const Article = module.exports = mongoose.model("Article", ArticleSchema);