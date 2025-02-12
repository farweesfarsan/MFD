const express = require('express');
const {registerUser,loginUser,logoutUser,forgotPassword,resetPassword, getUserProfile, changePassword} = require('../controller/authController');
const router = express.Router();
const {authenticatedUser} = require('../middleware/authMiddleware');


router.route('/register').post(registerUser);
router.route('/userLogin').post(loginUser);
router.route('/userLogout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/myProfile').get(authenticatedUser, getUserProfile);
router.route('/password/change').put(authenticatedUser,changePassword);
module.exports = router;