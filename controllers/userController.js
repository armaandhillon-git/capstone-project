const validator = require('validator');
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt")

let User = {}

let session;

User.sign_up = function(req, res){
    let errors = [];
	session = req.session;
	// If user already login, redirect to home page
	if(session.uid){
		res.redirect("/");
	}
	else{

		let email = req.body.email.trim();
		let fname = req.body.fname.trim();
		let phone = req.body.phone.trim();
		let address = req.body.address.trim();

		let password = req.body.password;
		let password2 = req.body.password2

		if (email == "") {
			errors.push(['email', "Please provide email address"]);
		} else if(!validator.isEmail(email)) {
			errors.push(['email', "Please provide email address"]);
		}
		if (fname.length < 3) {
			errors.push(['fname', "Please eneter a valid name"]);
		}
		if (address.length < 10) {
			errors.push(['address', "Please eneter a proper address"]);
		}
		if (!validator.isMobilePhone(phone)) {
			errors.push(['phone', "Please eneter a valid phone number"]);
		}

		if (password == "") {
			errors.push(['password', "Please enter a valid password"]);
		} else {
			if (password != password2) {
				errors.push(['password2', "Password not matched"]);
			}
		}
        UserModel.getUserByEmail(email, async function(err, response){
            //console.log(response);
            if(response.length){
                errors.push(['email', "Email address already exist"]);
            }
            if(errors.length){
                res.send(JSON.stringify(errors));
                return;
            }
            
            // Lets hash the password
            password = await bcrypt.hash(password, 10);
            
            // Create the user now
            UserModel.createUser({email, fname, phone, password, address}, function(err, response){
                if(err){
                    res.send("Error: "+ JSON.stringify(err));
                }
                else{
                    res.send("PASS");
                }

            });

        });



    }
}


User.login = function(req, res){
    let errors = [];
	session = req.session;
	// If user already login, redirect to home page
	if(session.uid){
		res.redirect("/");
	}
	else{

		let email = req.body.email.trim();
		let password = req.body.password;
		if (email == "" || password == "") {
			errors.push(['form_error', "Wrong login details"]);
		}
        if(errors.length){
            res.send(JSON.stringify(errors));
            return;
        }
        UserModel.getUserByEmail(email, async function(err, response){
            //console.log(response);
            if(!response.length){
                errors.push(['form_error', "Wrong login details"]);
                res.send(JSON.stringify(errors));
                return;
            }
            let user = response[0];
            //Verify password
            const verify_password = await bcrypt.compare(password, user.password);
            if(verify_password){
                req.session.uid = user.user_id;
                req.session.email = user.email;
                req.session.role = user.role;
                res.send("PASS");
                return;
            }
            else{
                errors.push(['form_error', "Wrong login details"]);
                res.send(JSON.stringify(errors));
                return;
            }


        });



    }
}

module.exports = User;
