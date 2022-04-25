/*
Variables to do be used with the API. Requiring npm package express and declaring port
server will use
*/
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app =  express()
const routes = require('./routes/routes')
const path = require('path')
const port = process.env.PORT || 4000
const trainingModel = require('./NLP/index')

const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json')

// Variables set for mongoose and database management
const mongoose = require('mongoose')

// Attempt to connect to database, if connected start the server and train the model
mongoose.connect(process.env.DATABASE_URL , {useNewUrlParser: true, useUnifiedTopology: true, }, (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    
    app.listen(port, async () => {
        console.log(`Server is listening at http://localhost:${port}/`)
        await trainingModel.trainModel()
        //console.log("Model trained");
    })
})

app.use(express.json())

// Route for swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Route for api endpoints
app.use('/api', routes)

// Have React handle unknown routes
app.use(express.static(path.join(__dirname, "..", "build")))
app.use(express.static(path.join(__dirname, "..", "public")))
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
  });
