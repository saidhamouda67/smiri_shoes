const upload=require('../utils/uploadImages')
const express=require('express');
const router=express.Router();
const authController=require('./../CONTROLLERS/authController')
const productController=require('./../CONTROLLERS/productController')
const orderController=require('./../CONTROLLERS/orderController')

router.post('/create-order',authController.protect,orderController.createOrderWithAccount)
router.post('/create-order-without-account',orderController.createOrderWithoutAccount)
router.get('/my-orders',authController.protect,orderController.getMyOrders)
router.get('/my-order/:order_id',authController.protect,orderController.getMyOrder)
router.get('/get-shipping-price',orderController.getShippingPrice)
router.get('/',authController.protect,authController.restrictTo('admin','manager'),orderController.getAllOrders)
router.get('/:id',authController.protect,authController.restrictTo('admin','manager'),orderController.getOrder)
router.patch('/update-my-order/:order_id',authController.protect,orderController.updateMyOrder)
router.patch('/cancel-order/:order_id',authController.protect,authController.restrictTo('admin','manager'),orderController.cancelOrder)
router.patch('/change-shipping-price',authController.protect,authController.restrictTo('admin','mangager'),orderController.updateShippingPrice)
 router.post('/confirm-payment-delivery/:order_id',authController.protect,authController.restrictTo('admin','manager'),orderController.confirmDeliveryAndPayment)
 router.post('/validate-order/:order_id',authController.protect,authController.restrictTo('admin','manager'),orderController.validateOrder)





module.exports=router;