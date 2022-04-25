/*
    Schema for the messages that will be sent to API, worked in the NLP and sent back to slack to be deconstructed

    Parameters:
    message: The message that will be sent from slack to be processed
    source: Where the message came from. Used in the case that other modalities are used such as email or website
    intent: The intent that is given from the NLP. Examples include ask_coveo, case_status, create_case
    slots: These are the keywords that give the intent meaning. Can be the number of a case or what the user wants to search in ask_coveo
    date: The date that the object was created. To be used for debugging purposes

    The objects will be stored in the mongodb database under the collection slackMessages
*/
const mongoose = require('mongoose')

const nlpSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,  
    },
    source: String,
    intent: String,
    isCorrect: Boolean,
    response: String,
    date: String
})

module.exports = mongoose.model("slackMessages", nlpSchema, "slackMessages")