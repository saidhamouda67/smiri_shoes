const upload=require('../utils/uploadImages')
const express=require('express');
const router=express.Router();
const authController=require('./../CONTROLLERS/authController')
const productController=require('./../CONTROLLERS/productController')
const reviewRouter=require('./../routes/reviewRouters')
router.use('/:product_id/reviews',reviewRouter)

router.post('/Add-Product',authController.protect,authController.restrictTo('admin','manager'),upload.array('images',4),productController.AddProduct)
router.post('/Add-product-details/:id_prod',authController.protect,authController.restrictTo('admin','manager'),productController.AddProductDetails)
router.get('/',productController.getAllProducts)
router.get('/product-details',authController.protect,authController.restrictTo('admin','manager'),productController.getAllProductDetails)
router.get('/:id',productController.getProduct)
router.delete('/:id',authController.protect,authController.restrictTo('admin'),productController.DeleteProduct)
router.patch('/:id',authController.protect,authController.restrictTo('admin','manager'),upload.array('images',4),productController.updateProduct);
router.delete('/related-details/:id_prod',authController.protect,authController.restrictTo('admin'),productController.DeleteRelatedDetails)
router.get('/related-details/:id_prod',authController.protect,authController.restrictTo('admin'),productController.getRelatedDetails)
router.patch('/link/:id_details/:id_prod',authController.protect,authController.restrictTo('admin'),productController.LinkDetails)

// router.post('/login',authController.login)
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