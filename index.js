
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


//creation of new espress object
const app= express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));









app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});















//for both : heroku and localhost

var port = process.env.PORT;
if(port==null || port==""){
  port=3000;
}

app.listen(port, function() {
  console.log("Server has started successfully on port "+ port);
});
