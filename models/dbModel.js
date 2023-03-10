const connection = require("../db");

const dbModel = {};

dbModel.execQuery = function(qry, vars, result) {
    connection.query(qry, vars, function(err, response) {
        if(err)
        	result(err, response);
		else
			result(null, response);
    });
}

dbModel.getOne = function(qry, vars, result) {
    connection.query(qry, vars, function(err, response) {
        if(err) throw err;
        if(response.length){
            return result(null, response[0]);
        }
        else{
            return result(null, null);
        }  
    });
}

dbModel.getAll = function(qry, vars, result) {
    connection.query(qry, vars, function(err, response) {
        if(err) throw err;
        return result(null, response);
    });
}

dbModel.createItem = function(item, result) {
    connection.query("INSERT INTO items SET?",item, function(err, response) {
        if(err){
            //console.log(response);
        	result(err, response);
        }
		else{
            //console.log(response);
			result(null, response);
        }
    });
}


dbModel.updateItem = function(item, prd_id,  result) {
    connection.query("UPDATE items SET ? WHERE prd_id = ?",[item, prd_id], function(err, response) {
        if(err){
         	result(err, response);
        }
		else{
         	result(null, response);
        }
    });
}


module.exports = dbModel;
