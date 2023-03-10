// User must be login in order to access this page

const {app_const} = require('./constants');
const express = require("express");
const userAuth = require("./middleware/auth");
const dbModel = require("./models/dbModel");
const user = require("./controllers/userController");
const multer = require('multer');
const fs = require("fs");
const path = require("path");


const router = express.Router();

// Use to Auth middleware to validate user
router.use(userAuth);


//! Use of Multer
let storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/uploads/')     // './public/uploads/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
}) 
let upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, //max 10mb
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});



let session;
// render Dashboard page
router.get("/", (req, res) => {
	session = req.session;

	dbModel.getOne("SELECT COUNT(*) AS cnt FROM items WHERE user_id = ?", [session.uid], function(err, response){
		let prd_cnt = response.cnt;
		dbModel.getOne("SELECT COUNT(*) AS cnt FROM items", [], function(err, response){
			let prd_cnt_all = response.cnt;
			res.render("user/index", {app_const, session, prd_cnt, prd_cnt_all});
		}); 
	});
});


// ADD Items Page
router.get("/add-item", (req, res) => {
	session = req.session;

	dbModel.getAll("SELECT * FROM locations", [], function(err, response){
		let locs = response;
		dbModel.getAll("SELECT * FROM categories", [], function(err, response){
			let cats = response;
			res.render("user/add-item", {app_const, session, locs, cats});
		}); 
	});
});


// ADD Items Page
router.get("/edit-item/:prd_id", (req, res) => {
	session = req.session;
	dbModel.getAll("SELECT * FROM locations", [], function(err, response){
		let locs = response;
		dbModel.getAll("SELECT * FROM categories", [], function(err, response){
			let cats = response;
            if(session.role == 0){ // If user is not admin
                dbModel.getOne("SELECT * FROM items WHERE user_id = ? AND prd_id = ?", [session.uid, req.params.prd_id], function(err, response){
                    let prd = response;
                    if(prd == null){
                        res.redirect('/user');
                        return;
                    }
                    res.render("user/edit-item", {app_const, session, locs, cats, prd});
                });
            }
            else{
                dbModel.getOne("SELECT * FROM items WHERE prd_id = ?", [req.params.prd_id], function(err, response){
                    let prd = response;
                    if(prd == null){
                        res.redirect('./');
                        return;
                    }
                    res.render("user/edit-item", {app_const, session, locs, cats, prd});
                });
            }
		}); 
	});
});


// REMOVE ITEM
router.delete("/remove-item/:prd_id", (req, res) => {
	session = req.session;
    if(session.role == 0){ // If user is not admin
        dbModel.getOne("SELECT * FROM items WHERE user_id = ? AND prd_id = ?", [session.uid, req.params.prd_id], function(err, response){
            try {fs.unlinkSync('public/uploads/'+response.prd_image);} catch (error) {console.log(error);}
            dbModel.execQuery("DELETE FROM items WHERE user_id = ? AND prd_id = ?", [session.uid, req.params.prd_id], function(err, response){
                res.send("PASS");
            });
        });
    }
    else{
        dbModel.getOne("SELECT *  FROM items WHERE prd_id = ?", [req.params.prd_id], function(err, response){
            try {fs.unlinkSync('public/uploads/'+response.prd_image);} catch (error) {console.log(error);}
            dbModel.execQuery("DELETE FROM items WHERE prd_id = ?", [req.params.prd_id], function(err, response){
                res.send("PASS");
            });
        });
    }
});



// USER Items Page
router.get("/my-items", (req, res) => {
	session = req.session;
    dbModel.getAll("SELECT a.*, b.fname, c.name AS cat_name, d.name AS loc_name FROM items a LEFT JOIN user b ON a.user_id = b.user_id LEFT JOIN categories c ON a.cat_id = c.cat_id LEFT JOIN locations d ON a.loc_id = d.loc_id WHERE a.user_id = ?", [session.uid], function(err, response){
		let prds = response;
		res.render("user/my-items", {app_const, session, prds});
	});

});


// Handle user add Items submission
router.post("/add-item", upload.single("prd_image"), user.add_item)


// Handle user  Items update  submission
router.post("/edit-item", upload.single("prd_image"), user.edit_item)




const checkFileType = function (file, cb) {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;
    
    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    
    const mimeType = fileTypes.test(file.mimetype);
    
    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("Error: You can Only Upload Images!!");
    }
};




module.exports = router;