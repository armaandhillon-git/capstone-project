const express = require("express");
const userAuth = require("./middleware/auth");

const router = express.Router();


// Use to Auth middleware to validate user
router.use(userAuth);

// render
router.get("/", (req, res) => {
    res.status(405);
	res.json({status: 405, message: 'Method not supported'});
});





module.exports = router;