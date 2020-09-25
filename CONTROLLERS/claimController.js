const User=require('./../models/userModel')
const catchAsync=require('./../utils/ErrorCatchAsync');
const AppError=require('./../utils/appError');
const factory=require('./handlerFactory')
const Order=require('./../models/orderModel')
const Claim=require('./../models/claimModel')



exports.getClaim=factory.getOne(Claim);

exports.getAllClaims=factory.getAll(Claim);

exports.createClaim=factory.createOne(Claim);


exports.handleClaim=catchAsync(async(req,res,next)=>{
    const claim=await Claim.updateOne({_id:req.params.id}, {
        "$set":{"handled":true}
    })
})