Search engine using Web search Api


Technologies used : 

html, css, bootstrap, js, node.js, express.js, ejs, api, atom


Dependencies :

{ "dependencies": { "body-parser": "^1.20.1", "dotenv": "^16.0.3",
"ejs": "^3.1.8", "express": "^4.18.2", "https": "^1.0.0", "jsdom": "^20.0.3",
"mongoose": "^6.7.3", "nodemailer": "^6.8.0", 
"nodemon": "^2.0.20", "request": "^2.88.2" } }


To run the project :

- install all the required packages -> npm install
- create a .env file in the project root
- request a key for the Web search APi https://rapidapi.com/contextualwebsearch/api/web-search/details
- configure the variable API_KEY, MONGODB_USERNAME, MONGODB_PASSWORD with your own, 
    - these configurations must be done in the .env file 
- run the command line nodemon index.js or node index.js in your Node.js command prompt
- open the app in your browser http://localhost:3000
