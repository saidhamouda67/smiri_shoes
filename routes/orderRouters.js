const upload=require('../utils/uploadImages')
const express=require('express');
const router=express.Router();
const authController=require('./../CONTROLLERS/authController')
const productController=require('./../CONTROLLERS/productController')
const orderController=require('./../CONTROLLERS/orderController')

router.post('/create-order',authController.protect,orderController.createOrder)
router.get('/my-orders',authController.protect,orderController.getMyOrders)
router.get('/my-order/:order_id',authController.protect,orderController.getMyOrder)
router.get('/',authController.protect,authController.restrictTo('admin','manager'),orderController.getAllOrders)
router.get('/:order_id',authController.protect,authController.restrictTo('admin','manager'),orderController.getOrder)
router.patch('/update-my-order/:order_id',authController.protect,orderController.updateMyOrder)
router.delete('/delete-my-order/:order_id',authController.protect,orderController.deleteMyOrder)

 router.post('/confirm-payment-delivery/:order_id',authController.protect,authController.restrictTo('admin'),orderController.confirmDeliveryAndPayment)
// router.post('/forgot-password',authController.forgotPassword);
// router.patch('/reset-password/:token',authController.resetPassword);

// //protect function to to make this happen ki yabda logged in kahaw
// router.patch('/update-my-password',authController.protect,authController.updateMyPassword)
// router.patch('/update-me',authController.protect,userController.updateMe)
// router.delete('/delete-me',authController.protect,userController.deleteMe)
// router.patch('/affect-role-to-user',authController.protect,authController.restrictTo('admin'),userController.affectRoleToUser)
// router.get('/me',authController.protect, userController.getMe,userController.getUser)
// router.route('/')
// .get(authController.protect,authController.restrictTo('admin','manager'),getAllUsers);

// router.route('/:id')
// .get(authController.protect,authController.restrictTo('admin','manager'),getUser)
// .patch(authController.protect,authController.restrictTo('admin'),userController.affectRoleToUser)
// .delete(authController.protect,authController.restrictTo('admin'),deleteUser)




module.exports=router;