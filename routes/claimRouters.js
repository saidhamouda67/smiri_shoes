const claimController=require('../CONTROLLERS/claimController');
const express=require('express')
const router=express.Router();
const authController=require('../CONTROLLERS/authController')

router.route('/')
.get(authController.protect,authController.restrictTo('admin'),claimController.getAllClaims)
.post(claimController.createClaim);

router.route('/:id')
.get(claimController.getClaim)



module.exports=router;