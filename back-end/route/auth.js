const express = require('express');
const multer = require('multer');
const path = require('path')

const upload = multer({storage: multer.diskStorage({
     destination: function(req, file, cb){
        cb(null,path.join(__dirname,'..','uploads/user'))
     },
     filename: function(req,file,cb){
        cb(null,file.originalname)
     }
})})

const {registerUser,
       sendOtp,
       verifyOtp,
       loginUser,
       logoutUser,
       forgotPassword,
       resetPassword,
       getUserProfile,
       changePassword,
       updateProfile,
       getAllUsers,
       getUserById,
       updateUser,
       deleteUser
       } = require('../controller/authController');

const { createDeliveryStaff,getDeliveryStaff }   = require('../controller/staffController')  
const router = express.Router();
const {authenticatedUser, authorizedRoles} = require('../middleware/authMiddleware');


router.route('/register').post(upload.single('avatar'),registerUser);
router.route('/sendOtp').post(sendOtp);
router.route('/verifyOtp').post(verifyOtp);
router.route('/userLogin').post(loginUser);
router.route('/userLogout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/myProfile').get(authenticatedUser, getUserProfile);
router.route('/password/change').put(authenticatedUser,changePassword);
// router.route('/update').put(authenticatedUser, updateProfile);
router.route('/update').put(authenticatedUser, upload.single('avatar'), updateProfile);
router.route('/deliveryStaff/:id').get(authenticatedUser,getDeliveryStaff);



//Admin Routes
router.route('/admin/users').get(authenticatedUser,authorizedRoles('admin'),getAllUsers);
// router.route('/admin/deliveryStaff/new').post(authenticatedUser,authorizedRoles('admin'),createDeliveryStaff);
router.route('/admin/users/:id').get(authenticatedUser,authorizedRoles('admin'),getUserById);
router.route('/admin/users/:id').put(authenticatedUser,authorizedRoles('admin'),updateUser);
router.route('/admin/users/:id').delete(authenticatedUser,authorizedRoles('admin'),deleteUser);
router.route('/staff/new').post(authenticatedUser,authorizedRoles('admin'), upload.single('avatar'),createDeliveryStaff);

module.exports = router;