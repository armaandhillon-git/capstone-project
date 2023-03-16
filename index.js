
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const user_router = require("./userRoute");
const validator = require('validator');

const User = require('./controllers/userController');



const {session_options, app_const} = require('./constants');
const dbModel = require('./models/dbModel');


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
	dbModel.getAll("SELECT a.*, b.fname, c.name AS cat_name, d.name AS loc_name FROM items a LEFT JOIN user b ON a.user_id = b.user_id LEFT JOIN categories c ON a.cat_id = c.cat_id LEFT JOIN locations d ON a.loc_id = d.loc_id ORDER BY a.added_date DESC LIMIT 20", [], function(err, prds){
		res.render("index", {app_const, session, prds});
	}); 	
});


// Display  Item  page 
app.get('/item/:prd_id', function(req, res){
	session = req.session;
	dbModel.getOne("SELECT a.*, b.fname, b.phone, b.address, c.name AS cat_name, d.name AS loc_name FROM items a LEFT JOIN user b ON a.user_id = b.user_id LEFT JOIN categories c ON a.cat_id = c.cat_id LEFT JOIN locations d ON a.loc_id = d.loc_id WHERE a.prd_id = ?", [req.params.prd_id], function(err, prd){
		res.render("item", {app_const, session, prd});
	}); 	
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


// Handle user  Logout Request 
app.get('/logout', function(req, res){
	if(req.session){
		req.session.destroy();
	}
	res.redirect("/");
});



// SEARCH PAGE 
app.get('/search', function(req, res){
	let session = req.session;
	
	let search_per_page = 10;
	let search = "";
	let loc_id = "";
	let cat_id = "";
	let wheres = [];
	let values = [];
	let page = 0;
	let prds = [];
	let qry_n = "";

	if (req.query.search && req.query.search.trim() != "") {
		search = req.query.search.trim();
		wheres.push("a.prd_name LIKE ?");
		values.push('%'+search+'%');
		qry_n += "search=" + encodeURIComponent(search);
	}
	if (req.query.loc_id && req.query.loc_id.trim() != "") {
		loc_id = parseInt(req.query.loc_id);
		wheres.push("a.loc_id = ?");
		values.push(loc_id);
		qry_n += "&loc_id=" +  loc_id;
	}
	if (req.query.cat_id && req.query.cat_id.trim() != "") {
		cat_id = parseInt(req.query.cat_id);
		wheres.push("a.cat_id = ?");
		values.push(cat_id);
		qry_n += "&cat_id=" +  cat_id;
	}

	page =  (req.query.page)? parseInt(req.query.page) : 1;
	page = (page < 1) ? 1 : page;

	let offset = (page - 1) * search_per_page;


	let qry = "SELECT a.*, c.name AS cat_name, d.name AS loc_name FROM items a LEFT JOIN categories c ON a.cat_id = c.cat_id LEFT JOIN locations d ON a.loc_id = d.loc_id";

	if(wheres.length > 0){
		qry += " WHERE " + wheres.join(' AND ');
	}

	qry += " LIMIT "+ offset + ",  " + search_per_page;

	dbModel.getAll("SELECT * FROM locations", [], function(err, locs){
		dbModel.getAll("SELECT * FROM categories", [], function(err, cats){
			dbModel.getAll(qry, values, function(err, prds){
				res.render("search", {app_const, session, prds, locs, cats, cat_id, loc_id, search, page, qry_n, search_per_page});	
			}); 
		});
	});
 	
});





app.listen(port, function () {
    console.log("Running  on port " + port);
});

