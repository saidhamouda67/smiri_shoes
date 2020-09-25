const User=require('./../models/userModel')
const {Product}=require('./../models/productModel')
const Order=require('./../models/orderModel')
const catchAsync=require('./../utils/ErrorCatchAsync');
const AppError=require('./../utils/appError');
const Claim=require('./../models/claimModel')

exports.getAdminsAndManager=catchAsync(async(req,res,next)=>{
    try{
    const list=await User.find({ $or:[ {'role':'manager'}, {'role':'admin'}] })

    res.status(200).json({
        status:'success',
        data:list
    })
}catch(error){
    res.status(300).json({
        status:'error',
        error
    })
}


})

exports.getAllData=catchAsync(async(req,res,next)=>{
    const countUsers=await User.countDocuments();
    const countOrders=await Order.countDocuments();
    const countClaims=await Claim.countDocuments();
    const countProducts=await Product.countDocuments();


    const data={
        'users':countUsers,
        'orders':countOrders,
        'claims':countClaims,
        'products':countProducts
    }

    res.status(200).json({
        status:'success',
        data
    })
})


