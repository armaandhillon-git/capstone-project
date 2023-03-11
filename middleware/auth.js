


function userAuth(req, res, next) {
	//console.log(req.session.uid);
    if(!req.session.uid){
		res.redirect("/");
	}
	else{
		next();
	}
}

module.exports = userAuth;