
function userAuth(req, res, next) {
    if(req.session.uid){
		res.redirect("/");
	}
	else{
		next();
	}
}

module.exports = userAuth;