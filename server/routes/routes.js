// Routes that require an API key to proceed
const express = require('express')
const router = express.Router()

// Call schema to use for storing the message data
const nlpModel = require(`../models/nlpSchema`)

// call schema to use for storing unclassfied or vague intents.
const vagueModel = require(`../models/vagueSchema`)

const trainingDataModel = require('../models/testDataSchema');

// Call file where writeToSchema method is located
const modelTraining = require(`../NLP/index`)

const jwtCheck = require(`./auth`);

// Route for UI debug webpage, doesn't require auth and everything is done locally
router.post('/client/message',  async (req,res) => {
	try{
		const uiMessage = { message: req.body.message,  date: new Date().toLocaleString('en-US', { timeZone: 'EST' })}
		// Send the message to the training and get the intent
		await modelTraining.writeToUIDebug(uiMessage)
		// Send posted message to NLP to be worked on
		res.send(uiMessage)
	} catch(err) {
		res.send({ error: `${err}`})
	}
})

// Route to get all the training data in 
router.get('/data/training', async (req, res) => {
	try{
		const trainingData = await trainingDataModel.find({})
		res.send(trainingData)
	}catch(err){
		res.send({ error : `${ err }`})
	}
})

// Route to delete a pattern from the training data
router.post('/data/training/delete', async(req, res) => {
	try{
		await modelTraining.deleteTrainingData(req.body.tag, req.body.patterns)
		res.send({message: `${req.body.patterns} deleted from training data`})
	}catch(err){
		console.log(err)
		res.send({ error: `${err}`})
	}
})

// Route to add to training data
router.post('/data/training/add', async (req, res) => {
	try {
		await modelTraining.addTrainingData(req.body)
		res.send({message: `Message and intent added to training data`})
	} catch (err) {
		res.send({ error: `${err}`})
	}
})

// Route to get all the unprocessed messages from database
router.get('/unprocessed', async (req, res) => {
	try{
		const vagueMessages = await vagueModel.find({})
		res.send(vagueMessages)
	}catch (err){
		res.send({ error: `${err}`})
	}
})

// Route to signal the server to train the model
router.get('/trainModel', async (req,res) => {
	try{
		await modelTraining.trainModel();
		res.send({ message: "Model Trained"})
	}catch (err){
		res.send({ error: `${err}`})
	}
})

// Route to get all the intents stored in the training data
router.get('/intent/all', async(req, res) => {
	try{
		const intents = new Array()
		const trainingData = await trainingDataModel.find({})
		trainingData.forEach((element) => {
			intents.push(element.tag)
		})
		res.send(intents)
	}catch(err){
		res.send({ error : `${err}`})
	}
})

//Any API routes under here require an auth token
//router.use(jwtCheck)

//GET all request
router.get('/message',  async (req,res) => {
	const messages = await nlpModel.find()
	res.send(messages)
})

// GET messages by id
router.get('/message/:id',  async (req,res) => {
	try{
		const message = await nlpModel.findById(req.params.id)
		res.send(message)
	} catch {
		res.status(404).send({ error: `Message does not exist`})
	}
})
//POST request. post a new message to get intent of
router.post('/message',  async (req,res) => {
	try{
		const postedMessage = new nlpModel({
			message: req.body.message,
			date: new Date().toLocaleString('en-US', { timeZone: 'EST' }),
			isCorrect: null
		})
		
		// Send the message to the training and get the intent
		await modelTraining.writeToSchema(postedMessage)

		if(postedMessage.intent === 'Vague' || postedMessage.intent === 'None'){
			const vague = new vagueModel({
				message: postedMessage.message,
				date: postedMessage.date,
				source: postedMessage.source,
			})
			await vague.save()
			}
		else{
		// Save message to DB
			await postedMessage.save()
			}

		// Send posted message to NLP to be worked on
		res.send(postedMessage)
	} catch(err) {
		res.send({ error: `${err}`})
	}
})

// Route to add a rating to a previously sent message
router.post('/message/rating', async(req, res) => {
	// User sends in id and rating
	const id = req.body.id
	const rating = req.body.isCorrect
	// Find the message with that id
	nlpModel.findByIdAndUpdate(
		id,
		{ "isCorrect": rating },
		  async function(err, model) {
			if(err){
			  console.log(err);
			}else{
				//Determine the rating of the message
				if(rating == true){
					const patternsArray = new Array()
					patternsArray.push(model.message)
					await modelTraining.addTrainingData([{tag: model.intent, patterns: patternsArray}])
				}else{
					const vague = new vagueModel({
						message: model.message,
						date: model.date,
						source: model.source,
					})
					await vague.save()
				}
				res.send({ message: "Rating Handled"})
			}
		  });
})

module.exports = router