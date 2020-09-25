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
router.get('/product-details/:id',productController.getProductDetail)
router.patch('/product-details/:id',authController.protect,authController.restrictTo('admin','manager'),productController.updateProductDetails)
router.delete('/product-details/:id',productController.DeleteProductDetails)
router.get('/:id',productController.getProduct)
router.delete('/:id',authController.protect,authController.restrictTo('admin','manager'),productController.DeleteProduct)
router.patch('/:id',authController.protect,authController.restrictTo('admin','manager'),upload.array('images',4),productController.updateProduct);
router.delete('/related-details/:id_prod',productController.DeleteRelatedDetails)
router.get('/related-details/:id_prod',authController.protect,authController.restrictTo('admin','manager'),productController.getRelatedDetails)
router.patch('/link/:id_details/:id_prod',authController.protect,authController.restrictTo('admin','manager'),productController.LinkDetails)



module.exports=router;