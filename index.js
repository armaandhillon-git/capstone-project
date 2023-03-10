
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const user_router = require("./userRoute");
const validator = require('validator');

const User = require('./controllers/userController');



const {session_options, app_const} = require('./constants');


let app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(sessions(session_options));

// cookie parser middleware
app.use(cookieParser());



app.set('view engine', 'ejs');  // We are using ejs as the rendering engine

let port = process.env.PORT || 8080;

app.use(express.static('public'));  // folder to serve our static files



let session;

app.use('/user', user_router);

// Display  home page 
app.get('/', function(req, res){
	session = req.session;
	res.render("index", {app_const, session}); 	
});


// Display  Signup page 
app.get('/sign-up', function(req, res){
	session = req.session;
	// If user already login, redirect to home page
	if(session.uid){
		res.redirect("/");
	}
	else{
		res.render("sign-up", {app_const, session});
	}
});

// Display  Login page 
app.get('/login', function(req, res){
	session = req.session;
	// If user already login, redirect to home page
	if(session.uid){
		res.redirect("/");
	}
	else{
		res.render("login", {app_const, session});
	}
});


// Handle user  sign up data 
app.post('/sign-up', User.sign_up);

// Handle user  Login Request 
app.post('/login', User.login);






app.listen(port, function () {
    console.log("Running  on port " + port);
});

