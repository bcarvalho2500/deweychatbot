/**
 * @author Luke Klegraefe
 * Require statements for TFJS and TFJS-USE
 * This script serves to create / train a model and perform actions based on that model. Called by @index
 */
const tf = require('@tensorflow/tfjs-node')
const use = require('@tensorflow-models/universal-sentence-encoder');
const path = require('path');
const { dirname } = require('path');

const DEFAULT_MODEL_NAME = 'my-model'
const TEMP_MODEL_NAME = 'temp-model'    // This could be used to save two models if multi-threading was allowed

var N_CLASSES = 6;
var ID_CLASSES = [];

/**
 * 
 * @param {*} tasks expects JSON data to encode {text: "", intent: ""}
 * @returns Embedding used for model fitting shape
 */
const encodeData = async (encoder, tasks) => {
    const sentences = tasks.map(t => t.text.toLowerCase());
    let ecoder = await use.load();
    const embeddings = await ecoder.embed(sentences);
    return embeddings;
};

/**
 * @param {*} data expects JSON data for encoding embeddings
 * @param {*} classes expects an array of all intents in the database
 * @returns a trained model
 * Encodes data for x-shape, maps data for y-shape (used for fitting)
 * Creates a sequential model, adds a Dense layer, fits the model based on ENV vars
 * ADAM optimizer used for training increments (speed/rate)
 */
const trainModel = async (encoder, data, classes) => {
    tf.engine().startScope();
    const xTrain = await encodeData(encoder, data);
    ID_CLASSES = classes;
    N_CLASSES = classes.length;

    console.log(classes)

    var mapDataStr = "data.map(t => ["
    for(var i = 0; i < classes.length; i++){
        if(i == classes.length - 1){
            mapDataStr = mapDataStr + "t.intent == '" + classes[i] + "' ? 1 : 0])"
        }
        else{
            mapDataStr = mapDataStr + "t.intent == '" + classes[i] + "' ? 1 : 0, "
        }
    }

    // Used to programmatically created mapped data for any given # of intents (N_CLASSES)
    var mapData = eval(mapDataStr)
    const yTrain = tf.tensor2d(
        mapData
    )

    /**
     * Sequential model allows you to add layers individually
     * Dense layer means neurons output to same 'n' number of neurons
     */
    var model = tf.sequential();
    model.add(
        tf.layers.dense({
            inputShape: [xTrain.shape[1]],
            activation: "softmax",
            units: N_CLASSES,
        }),
    );

    model.summary();    // Print model specifications
    model.compile({
        loss: "categoricalCrossentropy",
        optimizer: tf.train.adam(0.005),
        metrics: ['accuracy'],
    });

    history = await model.fit(xTrain, yTrain, {
        batchSize: 32,
        validationSplit: process.env.MODEL_VALIDATION_SPLIT,
        shuffle: true,
        epochs: process.env.MODEL_EPOCHS
    });

    await model.save('file://' + path.join(__dirname, DEFAULT_MODEL_NAME));
    // Clean up tensorflow variables
    tf.engine().endScope();
    tf.engine().disposeVariables();
    tf.engine().reset();
};

/**
 * @param {*} model expects an already trained model
 * @param {*} message expects a string to predict
 * @param {*} threshold expects a float (0.0 < 1.0) to determine intents on
 * @returns a prediction array specified in @index
 * Predict the intent, check for accuracies. If none are > threshold, return None
 */
const predictIntent = async(encoder, message, threshold) => {
    tf.engine().startScope();
    console.log("Predicting... " + message);

    var model = await tf.loadLayersModel('file://' + path.join(__dirname, 'my-model/model.json'));
    const xPredict = await encodeData(encoder, [{ text: message }]);
    const prediction = await model.predict(xPredict).data();

    for(var i = 0; i < prediction.length; i++){
        if(prediction[i] > threshold){
            console.log("Intent: " + ID_CLASSES[i])
            tf.engine().endScope();
            tf.engine().disposeVariables();
            tf.engine().reset();
            return [ID_CLASSES[i], prediction]
        }
    }
    return ["None", prediction]
};

module.exports = { trainModel, predictIntent };