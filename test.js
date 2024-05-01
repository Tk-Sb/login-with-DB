const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();

app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
  // Generate a random token
    const token = crypto.randomBytes(20).toString('hex');
  // Store the token in the database with an expiration time
  // ...

    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pmn4222@gmail.com',
        pass: '@#$newbest@#$'
    }
    });

    const mailOptions = {
    from: 'pmn4222@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
    http://localhost:3000/reset/${token}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (err, response) => {
        if(err){
            console.error('there was an error: ', err);
        }
        else{
            res.send('recovery email sent');
        }
    });
})