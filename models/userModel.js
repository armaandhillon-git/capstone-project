const connection = require("../db");

const UserModel = function(user) {
    this.email = user.email;
    this.fname = user.fname;
    this.phone = user.phone;
    this.address = user.address;
    this.password = user.password; 
};

UserModel.createUser = function(user, result) {
    connection.query("INSERT INTO user SET?", user, function(err, response) {
        if(err)
        	result(err, response);
		else
			result(null, response);
    });
}

UserModel.getUserByEmail = function(email, result) {
    connection.query("SELECT * FROM user WHERE email=?", [email], function(err, response) {
        if(err) throw err;
        return result(null, response);
    });
}

UserModel.getUserById = function(user_id, result) {
    connection.query("SELECT * FROM user WHERE user_id=?", [user_id], function(err, response) {
        if(err) throw err;
        return result(null, response);
    });
}

UserModel.updateUser = function(user_id, user, result) {
    connection.query("UPDATE user SET ? WHERE user_id = ?", [user, user_id], function(err, response) {
        if(err)
        	result(err, response);
		else
			result(null, response);
    });
}


UserModel.checkEmail = function(email, result) {
    connection.query("SELECT * FROM user WHERE email=?", [email], function(err, response) {
        if(err)
			return result(err, response);
		else
			return result(err, response);
    });
}


module.exports = UserModel;
