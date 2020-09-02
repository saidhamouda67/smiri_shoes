const Review=require('./../models/reviewModel')
const catchAsync=require('./../utils/ErrorCatchAsync')
const factory=require('./handlerFactory')



exports.getAllReviews=factory.getAll(Review)

exports.setProductUserIds=(req,res,next)=>{
    if(!req.body.product) req.body.product=req.params.product_id;
    if(!req.body.user) req.body.user=req.user.id;

 next();
}


exports.getReview=factory.getOne(Review);
exports.createReview=factory.createOne(Review);

exports.updateReview=factory.updateOne(Review);

exports.deleteReview=factory.deleteOne(Review);