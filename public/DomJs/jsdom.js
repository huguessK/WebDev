//jshint esversion: 6



var Newcol=document.getElementsByClassName('NewColor')[0];


 Newcol.addEventListener('click', function onClick() {
   var div=document.getElementsByClassName('hero')[0];
   if(Newcol.value==0){
     div.style.background="#2a5555";
     Newcol.value=1;
   }else{
     div.style.background="#eff4fd";
     Newcol.value=0;
   }

 });


//typing text effect

var i = 0;
var txt = "I'm a computer science and electronic engineer";
var speed = 50;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("typing-text").innerHTML += txt.charAt(i);
    i++;
    if(i==txt.length){
      i=0;
      document.getElementById("typing-text").innerHTML="";
    }
    setTimeout(typeWriter, speed);
  }
}

function zoo_animal(){
  //var port = process.env.PORT;
  //if(port==null || port==""){
    //port=3000;
//  }

  //get request to zoo page
  window.location.replace("http://localhost:3000/zoo");
}
