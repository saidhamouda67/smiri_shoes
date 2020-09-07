const User=require('./../models/userModel')
const catchAsync=require('./../utils/ErrorCatchAsync');
const AppError=require('./../utils/appError');
const factory=require('./handlerFactory')
const Order=require('./../models/orderModel')
const {Product,ProductDetails}=require('./../models/productModel')
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
exports.getAllOrders=factory.getAll(Order,[
     {path : 'user', select: 'email'},
     {path: 'orderItems.product_details'}
])
exports.getOrder=factory.getOne(Order,'user')
exports.updateMyOrder=catchAsync(async (req,res,next)=>{
    const updatedOrder=await Order.findByIdAndUpdate(req.params.order_id,req.body,{
        new: true,runValidators:true
    });
    res.status(200).json({
        status:'success',
       data:{
           order:updatedOrder
       }
    })
})
exports.getMyOrders=catchAsync(async (req,res,next)=>{
    const orders = await Order.find({ user: req.user });
    res.status(200).json({
        status:'success',
       data:{
           orders
       }
    })
})
exports.getMyOrder=catchAsync(async(req,res,next)=>{
    const orderId=req.params.order_id;
    const order=await Order.find({user:req.user,_id:orderId});
    if (order){
        res.status(200).json({
            status: 'success',
            data:{
                order
            }
        })
    }else{
        return next(new AppError('this order isnt yours or it does not exist at all'))
    }
})
    
exports.createOrder=catchAsync(async(req,res,next)=>{

        const orderItems=req.body.orderItems;
        var  itemsPrice=0;
        await asyncForEach(orderItems,async(el)=>{
           
            const product=await Product.findById(el.product)
            itemsPrice+=(product.price*el.qty);

        })
        const order=await Order.create({
        user: req.user,
        orderItems:req.body.orderItems,
        itemsPrice,
        shipping:{
            address: req.body.address,
            city: req.body.city,
            postalCode: req.body.postalCode
        },

    })
    if (order){
        res.status(200).json({
            status:"success",
            data:{
                order
            }
        })
    }
})


exports.deleteMyOrder=catchAsync(async (req,res,next)=>{
    const order_id=req.params.order_id;
    const user=req.user;
    const order=await Order.findOne({
        _id:order_id,
        user
    })
    
    if (order){
        if (!order.isDeliveredAndPaid){
       const result= await Order.findByIdAndDelete(order_id)
       if (result){
           res.status(200).json({
               status: 'sucess',
               message: 'order canceled and deleted'
           })
       }else {
           return next(new AppError('error while deleting'))
       }
    }else {
        return next(new AppError('order already delivered and paid so cannot be deleted or canceled'))
    }
    }else{
        return next(new AppError('order not found'))
    }
})

exports.confirmDeliveryAndPayment=catchAsync(async (req,res,next)=>{
    const order_id=req.params.order_id

    const theOrder=await Order.findById(order_id)
    const orderItems=theOrder.orderItems

    await asyncForEach(orderItems,async(el)=>{
        await  ProductDetails.updateOne(
            {_id: el.product_details},
            {$inc: { "countInStock" : - el.qty}}
        )
    })
    const order=await Order.updateOne(
        {_id:order_id},
        {"$set":{"isDeliveredAndPaid":true,"deliveredAndPaidAt": Date.now()}}
)
        if (order){
            res.status(200).json({
                status:'success',
                data:{
                    order
                }
            })
        }else return next(new AppError('Error while updating'))

    })