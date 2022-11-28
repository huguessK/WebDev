
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const request = require ("request");
const https= require("https");
var nodemailer = require('nodemailer');

//creation of new espress object
const app= express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


//animal api
//const zoo_api_url="https://zoo-animal-api.herokuapp.com/animals/rand";
const fish_api_url="https://www.fishwatch.gov/api/species"


// Initialize the Authentication of Gmail Options
var transportar = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:  process.env.EMAIL, // Your Gmail ID
    pass:  process.env.PASSWORD,         // Your Gmail Password
  },
});

console.log(transportar)
//contact me page
app.get("/contact-me",function(req,res){
  res.render("contact");
})

//message sent successfully display message-sent page
app.post("/message-sent",function(req,res){
  console.log(req.body);

  // Define mailing options like Sender Email and Receiver.
  var mailOptions = {
    from:  process.env.EMAIL, // Sender ID
    to:  process.env.EMAIL, // Reciever ID
    subject: "New message", // Mail Subject
    text: req.body.firstname+" "+ req.body.lastname+ " message: " + req.body.subject
  };

  // Send an Email
  transportar.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    console.log(info);
  });


  res.render("message-sent");
})



app.get("/projects",function(req,res){
  res.render("projects");
})


//get request to the root
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});



//get request to zoo page
app.get("/fish",function(req,res){


https.get(fish_api_url, (resp) => {
  let data = '';

  // Un morceau de réponse est reçu
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // La réponse complète à été reçue. On affiche le résultat.
  resp.on('end', () => {
    let datas=JSON.parse(data);
    console.log(datas[1]);
    res.render('fish',{data:datas[1]['Species Name']});
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
    res.render("ApiError");
});

});












//for both : heroku and localhost

var port = process.env.PORT;
if(port==null || port==""){
  port=3000;
}

app.listen(port, function() {
  console.log("Server has started successfully on port "+ port);
});
