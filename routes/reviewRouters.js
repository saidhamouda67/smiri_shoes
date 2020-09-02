const reviewController=require('./../CONTROLLERS/reviewController');
const express=require('express')
const router=express.Router({mergeParams:true});
const authController=require('./../CONTROLLERS/authController')

router.use(authController.protect)
router.route('/')
.get(reviewController.getAllReviews)
.post(authController.restrictTo('user'),reviewController.setProductUserIds, reviewController.createReview);

router.route('/:id')
.get(reviewController.getReview)
.patch(authController.restrictTo('user','admin'),reviewController.updateReview)
.delete(authController.restrictTo('user','admin'), reviewController.deleteReview)



module.exports=router;