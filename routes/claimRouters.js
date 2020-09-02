const claimController=require('../CONTROLLERS/claimController');
const express=require('express')
const router=express.Router();
const authController=require('../CONTROLLERS/authController')

router.use(authController.protect)
router.route('/')
.get(authController.restrictTo('admin','manager'),claimController.getAllClaims)
.post(authController.restrictTo('user'),claimController.setUserId, claimController.createClaim);
router.route('/my-claims')
.get(authController.restrictTo('user'),claimController.getMyClaims)
router.route('/:id')
.get(claimController.getClaim)
.patch(authController.restrictTo('user'),claimController.updateClaim)
.delete(authController.restrictTo('user','admin'), claimController.deleteClaim)



module.exports=router;