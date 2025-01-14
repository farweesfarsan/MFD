const express = require('express');
const {registerUser,loginUser,logoutUser} = require('../controller/authController');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/userLogin').post(loginUser);
router.route('/userLogout').get(logoutUser);
module.exports = router;