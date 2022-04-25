// Schema for unprocessed messages, messages which were given a none intent

const mongoose = require('mongoose')

const vagueSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,  
    },
    date: String
})

module.exports = mongoose.model("unprocessedMessages", vagueSchema, "unprocessedMessages")