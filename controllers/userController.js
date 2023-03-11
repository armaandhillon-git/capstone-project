const validator = require('validator');
const UserModel = require("../models/userModel");
const dbModel = require("../models/dbModel");
const bcrypt = require("bcrypt");
const fs = require("fs");


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

		if (password.length < 6) {
			errors.push(['password', "Please enter a valid password; minimum characters should be 6"]);
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




User.add_item = function(req, res){
    let errors = [];
	session = req.session;

    let user_id = session.uid;
    let prd_image = "";
    let prd_image_full = "";
    let cat_id = parseInt(req.body.cat_id);
    let loc_id = parseInt(req.body.loc_id);
    let prd_name = req.body.prd_name;
    let prd_desc = req.body.prd_desc;
    let price = req.body.price;
    
    if (prd_name.length < 3) {
        errors.push(['prd_name', "Please eneter a valid product name"]);
    }
    if (prd_desc.length < 12) {
        errors.push(['prd_desc', "Description too short"]);
    }
    if (!req.file) {
        errors.push(['prd_image', "Please upload a valid image file"]);
    }
    else{
        //console.log(req.file);
        prd_image_path =  req.file.path;
        prd_image = req.file.filename;
    }
    
    if(errors.length){
        if(prd_image != ""){
            try {fs.unlinkSync(prd_image_path);} catch (error) {}
        }
        res.send(JSON.stringify({errors}));
        return;
    }
    
    dbModel.createItem({user_id, prd_name, prd_desc, cat_id, loc_id, price, prd_image}, function(err, response){
        console.log(err);
        if(err){
            try {fs.unlinkSync(prd_image_path);} catch (error) {}
            res.send(JSON.stringify(err));
            return
        }
        let prd_id = response.insertId;
        res.send(JSON.stringify({prd_id}));
        
    });
}


User.edit_item = function(req, res){
    let errors = [];
	session = req.session;

    let user_id = session.uid;
    let prd_image = "";
    let prd_image_full = "";
    let prd_id = parseInt(req.body.prd_id);
    let cat_id = parseInt(req.body.cat_id);
    let loc_id = parseInt(req.body.loc_id);
    let prd_name = req.body.prd_name;
    let prd_desc = req.body.prd_desc;
    let price = req.body.price;
    
    if (prd_name.length < 3) {
        errors.push(['prd_name', "Please eneter a valid product name"]);
    }
    if (prd_desc.length < 12) {
        errors.push(['prd_desc', "Description too short"]);
    }
    if (req.file) {
        prd_image_path =  req.file.path;
        prd_image = req.file.filename;
    }
    if(errors.length){
        if(prd_image != ""){
            try {fs.unlinkSync(prd_image_path);} catch (error) { console.log(error);}
        }
        res.send(JSON.stringify({errors}));
        return;
    }
    let query = "SELECT * FROM items WHERE user_id = ? AND prd_id = ?";
    let values = [session.uid, prd_id];
    let item_data = {prd_name, prd_desc, cat_id, loc_id, price}
    if(session.role == 1){ // If admin
        query = "SELECT * FROM items WHERE prd_id = ?";
        values = [prd_id];
    }
    // Get previous item details.
    dbModel.getOne(query, values, function(err, bf_item){
        
        if(bf_item == null){
            res.redirect("/");
            return;
        }
        if(prd_image != ""){
            item_data["prd_image"] = prd_image;
        }
        dbModel.updateItem(item_data, prd_id, function(err, response){
            if(err){
                if(prd_image != ""){
                    try {fs.unlinkSync(prd_image_path);} catch (error) {}
                }
                res.send(JSON.stringify(err));
                return
            }
            if(prd_image != ""){ // Delete previous image
                try {fs.unlinkSync('public/uploads/'+bf_item.prd_image);} catch (error) {console.log(error);}  
            }
            let prd_id = response.insertId;
            res.send(JSON.stringify({prd_id}));
            
        });
    });
}



User.update_profile = function(req, res){
    let errors = [];
	session = req.session;
	
    let email = req.body.email.trim();
    let fname = req.body.fname.trim();
    let phone = req.body.phone.trim();
    let address = req.body.address.trim();


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

    dbModel.getOne("SELECT * FROM user WHERE email = ? AND user_id != ?", [email, session.uid], function(err, response){
        //console.log(response);
        if(response != null){
            errors.push(['email', "Email address already exist"]);
        }
        if(errors.length){
            res.send(JSON.stringify(errors));
            return;
        }
        
        // UPFATE the user no
        UserModel.updateUser(session.uid, {email, fname, phone,address}, function(err, response){
            if(err){
                res.send("Error: "+ JSON.stringify(err));
            }
            else{
                res.send("PASS");
            }
        });

    });


}



User.change_password = function(req, res){
    let errors = [];
	session = req.session;

    let opassword = req.body.opassword;
    let password = req.body.password;
    let password2 = req.body.password2

    if (password.length < 6) {
        errors.push(['password', "Please enter a valid password; minimum characters should be 6"]);
    } else {
        if (password != password2) {
            errors.push(['password2', "Password not matched"]);
        }
    }
    UserModel.getUserById(session.uid, async function(err, response){
        //console.log(response);
        if(!response.length){
            res.send("Please refresh page");
            return;
        }
        //Verify old password
        const verify_password = await bcrypt.compare(opassword, response[0].password);
        if(!verify_password){
            errors.push(['opassword', "Password not correct"]);
        }
        if(errors.length){
            res.send(JSON.stringify(errors));
            return;
        }
        // Lets hash the password
        password = await bcrypt.hash(password, 10);
        
        // Update the user password
        UserModel.updateUser(session.uid, {password}, function(err, response){
            if(err){
                res.send("Error: "+ JSON.stringify(err));
            }
            else{
                res.send("PASS");
            }
        });

    });

}




module.exports = User;
