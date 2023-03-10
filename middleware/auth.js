


function userAuth(req, res, next) {
	//console.log(req.session.uid);
    if(!req.session.uid){

		req.session.uid = 13;
        req.session.email = 'emma@gmail.com';
        req.session.role = '0';
		next();


		//res.redirect("/");
	}
	else{
		next();
	}
}

module.exports = userAuth;