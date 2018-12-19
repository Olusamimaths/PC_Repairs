const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const port = process.env.PORT || 3000
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', function(req, res){
	res.render('index', {title: 'Computer Not Working?'});
});

app.get('/about', function(req, res){
	res.render('about');
});
app.get('/contact', function(req, res){
	res.render('contact');
});

app.get('/thankyou', function(req, res){
	res.render('thankyou');
});

app.post('/contact/send', (req, res, next) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'solathecoder@gmail.com',
            pass: process.env.PASS_W
        }
    })

    const mailOptions = {
        from: 'Olusola  <solathecoder@gmail.com>',
        to: 'olusola.samuel.oluwatobi@gmail.com',
        subject: 'Contact form submission',
        text: `You have a submission with the following details...Name: ${req.body.name}. Email: ${req.body.email}
                . Message: ${req.body.message}`,
        html: `<p>You have a submission with the following details<p> <ul><li>Name: ${req.body.name}</li><li> Email: ${req.body.email}
        </li><li>Message: ${req.body.message}</li></ul>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error)
            res.redirect('/')
        } else {
            console.log('Message sent:', info.response)
            res.redirect('/thankyou')
        }
    })
})

app.listen(port)
console.log(`Server started at port ${port}`)