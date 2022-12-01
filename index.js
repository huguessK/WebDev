
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


//news data copy

let newsCopy=[];

//news api
const options = {
	"method": "GET",
	"hostname": "contextualwebsearch-websearch-v1.p.rapidapi.com",
	"port": null,
	"path": "/api/search/NewsSearchAPI?q=allassane%20ouattara&pageNumber=1&pageSize=10&autoCorrect=true&fromPublishedDate=null&toPublishedDate=null",
	"headers": {
		"X-RapidAPI-Key": process.env.API_KEY,
		"X-RapidAPI-Host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
		"useQueryString": true
	}
};

//contact me page
app.get("/contact-me",function(req,res){
  res.render("contact");
})

//message sent successfully display message-sent page
app.post("/message-sent",function(req,res){

  //just to see the request's body
  console.log(req.body);

  // Define message object to send in database(mongodb)
  var message = {
    email:  req.body.email, // Sender ID
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    content:req.body.subject
  };


  res.render("message-sent");
})






//request to projects page
app.get("/projects",function(req,res){
  res.render("projects");
})




//get request to the root
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});



//get request to news page
app.get("/news",function(request,response){

  const req = https.request(options, function (res) {
  let chunks = "";

  	res.on("data", function (chunk) {
  		chunks += chunk;
  	});

  	res.on("end", function () {
      let datas=JSON.parse(chunks);
			datas=datas["value"];
			let news=[];
			for(let i=0; i<datas.length; i++){
				//let img_url=datas[i]["image"]["url"].toLowerCase();
				//if(img_url.substr(img_url.length - 4).includes("jpg") || img_url.substr(img_url.length - 4).includes("png") ){
				//news.push(
				//	[ datas[i]["image"]["url"],
				//	datas[i]["title"] ] );
				//	}

					if(datas[i]["image"]["url"]!=""){
						news.push(
							[ datas[i]["image"]["url"],
							datas[i]["title"] ,
								//datas[i]["description"],
								datas[i]["body"],
								datas[i]["snippet"],
								datas[i]["datePublished"]
						]);
					}



			}//end for bracket
			newsCopy=news;

			//console.log(news);
    response.render('news',{data:news});
  	});


    res.on("error", (err) => {
   console.log("Error: " + err.message);
     res.render("ApiError");
   });

 });
   req.end();
 });


 //request to news-content page
 app.get("/news-content/:contentID",function(req,res){
	 let id=req.params.contentID;
	 //console.log(id);
	 //console.log(typeof(id));
   res.render("news-content",{data:newsCopy,id:id});
 })











//for both : heroku and localhost

var port = process.env.PORT;
if(port==null || port==""){
  port=3000;
}

app.listen(port, function() {
  console.log("Server has started successfully on port "+ port);
});
