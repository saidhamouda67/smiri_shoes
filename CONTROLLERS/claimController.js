const User=require('./../models/userModel')
const catchAsync=require('./../utils/ErrorCatchAsync');
const AppError=require('./../utils/appError');
const factory=require('./handlerFactory')
const Order=require('./../models/orderModel')
const Claim=require('./../models/claimModel')



exports.getClaim=factory.getOne(Claim);
exports.getMyClaims=catchAsync(async (req,res,next)=>{
    const claims=await Claim.find({user:req.user.id}).populate({
        path: 'user',select:'email'
    });
    res.status(200).json({
        data:{
            claims
        }
    })
})
exports.getAllClaims=factory.getAll(Claim,{path:'user', select: 'email'});
exports.setUserId=catchAsync(async (req,res,next)=>{
    if(!req.body.user) req.body.user=req.user.id;
    next();
})
exports.createClaim=factory.createOne(Claim);

exports.updateClaim=factory.updateOne(Claim);

exports.deleteClaim=factory.deleteOne(Claim);