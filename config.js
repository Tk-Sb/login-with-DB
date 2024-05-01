const mongoose = require("mongoose")
const dbURI = "mongodb+srv://pmn:4eSvKxhFxhHHOG2V@test-1.qos1oc2.mongodb.net/?retryWrites=true&w=majority&appName=test"

mongoose.connect(dbURI).then((result) => {
    console.log("connected to the DB")
}).catch((err) => {
    console.log(err)
})

// schema for user data
const loginSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
})

// model for user data
const collection = new mongoose.model("users", loginSchema)


// schema for token
const tokenSchema = new mongoose.Schema({
    token: {type: String, required: true},
})

// model for token
const tokenModel = new mongoose.model("tokens", tokenSchema)







module.exports = {collection, tokenModel}