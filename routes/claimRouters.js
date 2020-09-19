const claimController=require('../CONTROLLERS/claimController');
const express=require('express')
const router=express.Router();
const authController=require('../CONTROLLERS/authController')

router.route('/')
.get(authController.restrictTo('admin'),claimController.getAllClaims)
.post(authController.restrictTo('user'), claimController.createClaim);

router.route('/:id')
.get(claimController.getClaim)



module.exports=router;