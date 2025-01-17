const express = require('express');
const {registerUser,loginUser,logoutUser,forgotPassword,resetPassword} = require('../controller/authController');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/userLogin').post(loginUser);
router.route('/userLogout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
module.exports = router;