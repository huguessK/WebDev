
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const request = require ("request");
const https= require("https");

//creation of new espress object
const app= express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//animal api
const zoo_api_url="https://zoo-animal-api.herokuapp.com/animals/rand";




app.get("/projects",function(req,res){
  res.render("projects");
})


//get request to the root
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});



//get request to zoo page
app.get("/zoo",function(req,res){


https.get(zoo_api_url, (resp) => {
  let data = '';

  // Un morceau de réponse est reçu
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // La réponse complète à été reçue. On affiche le résultat.
  resp.on('end', () => {
    let datas=JSON.parse(data);
    console.log(datas);
    res.render('zoo',{data:datas});
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
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
