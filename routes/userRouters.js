const express=require('express');
const router=express.Router();
const authController=require('./../CONTROLLERS/authController')
const userController=require('./../CONTROLLERS/userController')
const adminController=require('./../CONTROLLERS/adminController')
const {getAllUsers,getUser,createUser,deleteUser,updateUser}=require('../CONTROLLERS/userController')
router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.get('/logout',authController.protect,authController.logout)
router.post('/forgot-password',authController.forgotPassword);
router.patch('/reset-password/:token',authController.resetPassword);
//protect function to to make this happen ki yabda logged in kahaw
router.patch('/update-my-password',authController.protect,authController.updateMyPassword)
router.patch('/update-me',authController.protect,userController.updateMe)
router.delete('/delete-me',authController.protect,userController.deleteMe)
router.patch('/affect-role-to-user',authController.protect,authController.restrictTo('admin'),userController.affectRoleToUser)
router.get('/me',authController.protect, userController.getMe,userController.getUser)
router.route('/')
.get(authController.protect,authController.restrictTo('admin'),getAllUsers);
router.get('/get-all-data-count',authController.protect,authController.restrictTo('admin'),adminController.getAllData)
router.route('/:id')
.get(authController.protect,authController.restrictTo('admin'),getUser)
.patch(authController.protect,authController.restrictTo('admin'),userController.affectRoleToUser)
.delete(authController.protect,authController.restrictTo('admin'),deleteUser)

router.get('/get-admins-managers',authController.protect,authController.restrictTo('admin'),adminController.getAdminsAndManager)



module.exports=router;