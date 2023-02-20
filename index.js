//jshint esversion: 6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const request = require ("request");//not used in the end
const https= require("https");
//const nodemailer = require('nodemailer');//not used in the end
//const $= require("jquery"); //not used in the end

//creation of new espress object
const app= express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


//news data copy, pageId

let newsCopy=[];
let NewsContent=[];
let pageId=0;
let numberResults=0;
let pageNumber=0;
let screenWidth=0;

//news api
const OptionPath1="/api/search/NewsSearchAPI?q=";
const OptionPath2="&pageNumber=1&pageSize=50&autoCorrect=true&fromPublishedDate=null&toPublishedDate=null";

const options = {
	"method": "GET",
	"hostname": "contextualwebsearch-websearch-v1.p.rapidapi.com",
	"port": null,
	"path": "",
	"headers": {
		"X-RapidAPI-Key": process.env.API_KEY,
		"X-RapidAPI-Host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
		"useQueryString": true
	}
};



//about me page
app.get("/about-me",function(req,res){
  res.render("about");
})


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



//request to aiqualityApp page
app.get("/airqualityApp",function(req,res){
  res.render("airqualityApp");
})


//request to projects page
app.get("/projects",function(req,res){
  res.render("projects");
})



//get request to the root
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});



//post(search form) to news page
app.post("/news",function(request,response){

	//catch entered text and update api options
	let body=request.body.searchText;
	body=body.toLowerCase();
	body=encodeURIComponent(body.trim());
	console.log(body);
 	options["path"]=OptionPath1+body+OptionPath2;

  const req = https.request(options, function (res) {
  let chunks = "";

  	res.on("data", function (chunk) {
  		chunks += chunk;
  	});

  	res.on("end", function () {
      let datas=JSON.parse(chunks);
			datas=datas["value"];
			numberResults=datas.length; //between 0 to 50 for a given research
			let news=[];
			for(let i=0; i<datas.length; i++){

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
			NewsContent=news.slice(0,9);
			//console.log(news);
			pageNumber=Math.floor(numberResults/10)+1;
			pageId=1;
    response.render('news',{data:NewsContent, numberResults: pageNumber, pageId:1, width:screenWidth});
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

   res.render("news-content",{data:NewsContent,id:id});
 })


 //to manage the other content pages
 app.get("/news/:ID",function(req,res){
 	let id=req.params.ID;
	id=parseInt(id);


	if(id>30){
		screenWidth=id; //screen width in px
			res.render("news",{data:["welcome"]});
	}


	else if(id>=1 && id<=30){
		pageId=id;
	}


	//previous page
	else if (id===0) {
		if(pageId>1){
			pageId--;
		}
	}


	//Next page
	else{
		pageId++;
		if(pageId>=pageNumber){
			pageId=1;
		}
	}

	//render page
	if(newsCopy.length>=pageId*10 -1){
		res.render("news",{data:newsCopy.slice((pageId-1)*10,(pageId*10)), numberResults: pageNumber, pageId:pageId, width:screenWidth });
		NewsContent=newsCopy.slice((pageId-1)*10,(pageId*10));
	}

	else{
		res.render("news",{data:newsCopy.slice((pageId-1)*10,newsCopy.length), numberResults: pageNumber, pageId:pageId, width:screenWidth});
		NewsContent=newsCopy.slice((pageId-1)*10,newsCopy.length);
	}

 })



 /*request to news page
 app.get("/news",function(req,res){
	res.render("news",{data:["welcome"]});
})*/


//send form data : email, last name, first name, message to mongodb
//connection to mongo db locally

mongoose.connect("mongodb+srv://"+process.env.MONGODB_USERNAME+":"+process.env.MONGODB_PASSWORD+"@contactmessage.3sihltd.mongodb.net/messageDB",function(err){
  if(err){
    console.log("connection to db failed");
    console.log(err);
  } else{

    console.log("connection to db succeed");
  }

});

const messageSchema = new mongoose.Schema ({
  email: String,
  firstname: String,
  lastname: String,
  message: String
});

const Message = mongoose.model("Message", messageSchema);


app.post("/contact",function(req,res){

const contactMessage = new Message ({
	email:req.body.email,
	firstname:req.body.firstname,
	lastname:req.body.lastname,
	message:req.body.subject
});

contactMessage.save(function(err){
	if(err){
		res.send("something goes wrong, please try again!");
	}
	else{
		res.render("message-sent");

	}
}); //to insert the message in the DB


})//end app.post




//for both : heroku and localhost

var port = process.env.PORT;
if(port==null || port==""){
  port=3000;
}

app.listen(port, function() {
  //console.log("Server has started successfully on port "+ port);
	console.log("Server has started successfully");
});
