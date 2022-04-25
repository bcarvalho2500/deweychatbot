/*
    Schema for the training data, contains a tag (intent) and arrays for user inputs and chatbot responses

    Parameters:
    tag: The intent of the message
    patterns: Potential user inputs
    responses: Potential chatbot responses

    The objects will be stored in the mongodb database under the collection trainingData
*/
const mongoose = require('mongoose')

const trainingSchema = new mongoose.Schema({
    tag: String,
    patterns: [
        {
            type: String,
        }
    ],
    responses: [
        {
            type: String,
        }
    ],
})

module.exports = mongoose.model("trainingData", trainingSchema, "trainingData")