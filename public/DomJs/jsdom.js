//jshint esversion: 6





//typing text effect

let i = 0;
//let txt = "I'm a computer science and electronic engineer"
let txt= "Welcome to my website!";

const speed = 75;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("typing-text").innerHTML += txt.charAt(i);
    i++;
    /*if(i==txt.length){
     i=0;
     document.getElementById("typing-text").innerHTML="";
   }*/
    setTimeout(typeWriter, speed);
  }
}

function news(){
  //get request to news page
  //window.location.replace("http://localhost:3000/news");
  let screenwidth=window.screen.width;
  window.location.replace("/news/"+screenwidth);
}
