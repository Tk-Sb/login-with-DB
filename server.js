const express = require("express")
const bcrypt = require("bcryptjs")
const { collection, tokenModel } = require("./config.js")
const { default: mongoose, Collection } = require("mongoose")
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express()

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get("/log", (req, res) => {
    res.render("login")
})

app.post("/log", async (req, res) => {
    // gets data from html form
    const data = {
        username: req.body.username,
        password: req.body.password,
    }

    // checks if username exists
    const usernameExists = await collection.findOne({username: data.username})

    if(usernameExists){ // username does exists
        // compare given password with the real password
        const passwordsMatched = await bcrypt.compare(data.password, usernameExists.password) // takes true when password is correct

        if(passwordsMatched){ // password correct
            // take user to the home page
            res.send("Welcome to the home page")
        }
        else{ // password incorrect
            // ask user to try again
            res.send("incorrect password, try again...")
        }
    }
    else{ // username doesn't exist
        // ask user to try again
        res.send("user not found, try again...")
    }
})

app.get("/sign", (req, res) => {
    res.render("sign-in")
})

app.post("/sign", async (req, res) => {
    // gets data from html form
    const data = {
        username: req.body.username,
        password: req.body.password,
    }
    
    // checks if username in use
    const usernameExists = await collection.findOne({username: data.username})
    if(usernameExists){ // username does exists
        res.send("user in use")
    }
    else{ // username doesn't exist
        // hashing password using bcrypt.js
        const hashedPassword = await bcrypt.hash(data.password, 10)
        data.password = hashedPassword

        // add user to DB
        const userData = await collection.insertMany(data)
        
        res.send("user added")
    }
})

app.get("/forgot-password", (req, res) => {
    res.render("forgot-password")
})

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body
    console.log(email)
    // generating a random token using crypto
    const token = {
        token: crypto.randomBytes(10).toString('hex')
    }
    
    // storing the token in the DB then removing it after 2 mins
    const tokenDB = await tokenModel.insertMany(token)


    const transporter = nodemailer.createTransport({
        host: "live.smtp.mailtrap.io",
        port: 587,
        service: 'gmail',
        auth: {
            user: 'api',
            pass: 'a1b3a50b53d68ad699f46d7c0b0c9f97'
        }
    })
    
    const mailOptions = {
        from: 'info@pmn@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
        http://localhost:3000/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    }
    
    transporter.sendMail(mailOptions, (err, response) => {
        if(err){
            console.error('there was an error: ', err);
        }
        else{
            res.send('recovery email sent');
        }
    })
})

app.listen(3000, () => {
    console.log("server is listening on port 3000")
})