/**
 * @author Luke Klegraefe
 * Require statements for database schemas, nlpModel.js
 */
const testModel = require('../models/testDataSchema');
const slackModel = require('../models/nlpSchema');
const unprocessedModel = require('../models/vagueSchema');

const tfModel = require('./nlpModel')
const encoder = require('@tensorflow-models/universal-sentence-encoder')
const moment = require('moment');   // Used to get the age of messages
var classes = [];

/**
 * Called at server start. Fetches training data from the database and feeds it to the NLP model
 * Await model training completion and saves the model as 'my-model'
 */
async function trainModel(){
  try{
    var objIntents = await getTrainingData();
    var jsonData = [];
    classes = [];

    // Convert training data to new format for model
    for(var key in Object.keys(objIntents)){
      classes.push(objIntents[key].tag);
      var texts = objIntents[key].patterns;
      texts.forEach(element => {
        jsonData.push({"text": element, "intent": objIntents[key].tag})
      });
    }

    await tfModel.trainModel(encoder, jsonData, classes);   // Await completion of model training
    console.log("Model Trained Successfully");
  } 
  catch(err) {
    console.error(err);
  }

  // Remove all Slack messages older than 30 days
  try{
    const slackData = await slackModel.find({});
    var slackArrayToString = JSON.stringify(slackData);
    var objSlackData = JSON.parse(slackArrayToString);

    // time to live index
    for(var i = Object.keys(objSlackData).length; i <= 0; i--){
      var date = moment(objSlackData[i].date, 'MM/DD/YYYY');
      if(moment().diff(date, 'days') >= 30){
        await slackModel.deleteOne({date: objSlackData[i].date})
      }
      else{
        break;
      }
    }
  }
  catch(err){
    console.error(err);
  }
}

/**
 * @param {*} schema
 * @var prediction returns prediction array [intent index, [all accuracies]]
 * Fetch the training data to get responses
 * Await predictIntent
 * Alterable threshold for accuracy
 * Set schema values accordingly
 */
async function writeToSchema(schema) {
  try{
    var objIntents = await getTrainingData();

    const text = schema.message
    var threshold = 0.6;
    const prediction = await tfModel.predictIntent(
        encoder, text, threshold
    );

    schema.intent = prediction[0];
    // [0.10, 0.85, 0.5]
    var classIndex = prediction[1].indexOf(Math.max.apply(null, prediction[1]));
    // Set chatbot response to random response (flavor-text)
    schema.response = objIntents[classIndex].responses[Math.floor(Math.random() * (objIntents[classIndex].responses.length - 0) + 0)];
  } 
  catch(err) {
    console.error(err);
  }
}

/**
 * @param {*} schema 
 * Serves a similar function to @function writeToSchema but does not alter the database
 * Used for debug testing on the front-end
 */
async function writeToUIDebug(schema){
  try{
    var objIntents = await getTrainingData();

    // Get message from stored user input
    const text = schema.message;
    var threshold = 0.6;
    const prediction = await tfModel.predictIntent(
        encoder, text, threshold,
    );

    schema.intent = prediction[0];
    var classIndex = prediction[1].indexOf(Math.max.apply(null, prediction[1]));
    schema.answer = objIntents[classIndex].responses[Math.floor(Math.random() * (objIntents[classIndex].responses.length - 0) + 0)];

    // Reformat the results for front-end display
    jsonClassifications = [];
    for(var i = 0; i < prediction[1].length; i++){
      jsonClassifications.push({"intent": classes[i], "score": prediction[1][i]});
    }

    schema.classifications = jsonClassifications;
    schema.score = Math.max.apply(null, prediction[1]);
    console.log('Finished classifying intents');
  } 
  catch(err) {
    console.error(err);
  }
}

/**
 * @param {*} dataToTrain takes an input JSON file
 * Iterates over each intent, checks if the intent is present in the training data or not
 * If it is, adds only new patterns to the object
 * If it is not, adds the entire object as new to the collection
 */
async function addTrainingData(dataToTrain){
  var objIntents = await getTrainingData();
  var intentExists = false;

  for(var i in dataToTrain){
    intentExists = false;
    if(objIntents.some(item => item.tag == dataToTrain[i].tag)){    // If the intent is already found, only add new patterns
      intentExists = true;
      var idx = Object.keys(objIntents).find(key => objIntents[key].tag === dataToTrain[i].tag);
      for(var k in dataToTrain[i].patterns){
        testModel.findByIdAndUpdate(
          objIntents[idx]._id,
          { $push: {"patterns": dataToTrain[i].patterns[k]}},
          { safe: true, upsert: true},
            function(err, model) {
              if(err){
                console.log(err);
              }
            });
        if(unprocessedModel.find({message: dataToTrain[i].patterns[k]})){
          await unprocessedModel.deleteOne({message: dataToTrain[i].patterns[k]});
        }
      }
    }
    if(!intentExists){    // If the intent is new, add a new object to the collection
      const newTrainingData = new testModel({
        tag: dataToTrain[i].tag,
        patterns: dataToTrain[i].patterns,
		    responses: dataToTrain[i].responses
      });
      for(var k in dataToTrain[i].patterns){
        if(unprocessedModel.find({message: dataToTrain[i].patterns[k]})){
          await unprocessedModel.deleteOne({message: dataToTrain[i].patterns[k]});
        }
      }
      await newTrainingData.save();   // Save to the database
    }
  }
}

/**
 * @param {*} tag = Intent to delete
 * @param {*} pattern = Pattern to delete
 * Iterates through the training data and removes tags or patterns
 * Saves to the database
 */
async function deleteTrainingData(tag, pattern){
	const trainingData = await getTrainingData();

	for(var i in trainingData){
		if(trainingData[i].tag == tag){
			for(var j in trainingData[i].patterns){
				if(trainingData[i].patterns[j] == pattern){
          if(trainingData[i].patterns.length == 1){
            await testModel.findOneAndDelete({_id: trainingData[i]._id})
          }
          else{
            await testModel.findByIdAndUpdate(
              trainingData[i]._id,
              { $pull: {"patterns": pattern}},
              { safe: true, upsert: true},
                function(err, model) {
                if(err){
                  console.log(err);
                }
                });
          }
				}
			}
      break;
		}
	}
}

/**
 * Used to get a reference to iterable training data
 * @returns JSON object of the entire training data set
 */
async function getTrainingData(){
  const data = await testModel.find({});
  var arrayToString = JSON.stringify(data);
  return JSON.parse(arrayToString);
}

module.exports = { trainModel, writeToSchema, writeToUIDebug, addTrainingData, deleteTrainingData}