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
exports.getAllOrders=factory.getAll(Order)
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
    

exports.createOrderWithoutAccount=catchAsync(async(req,res,next)=>{
    const orderItems=req.body.orderItems;
    var  itemsPrice=0;
    await asyncForEach(orderItems,async(el)=>{
        const product=await Product.findById(el.product)
        itemsPrice+=(product.price*el.qty);
    })
   
    const theOrderedOrder={
        orderItems:req.body.orderItems,
        itemsPrice,
        shipping:{
            address: req.body.address,
            city: req.body.city,
            postalCode: req.body.postalCode
        },
        email:req.body.email ,
        phoneNumber:req.body.phoneNumber
    }
  
    const order=await Order.create(theOrderedOrder)
    
    await asyncForEach(theOrderedOrder.orderItems,async(el)=>{
        await  ProductDetails.updateOne(
            {_id: el.product_details},
            {$inc: { "countInStock" : - el.qty}}
        )
    })
if (order){
    res.status(200).json({
        status:"success",
        data:{
            order
        }
    })
}else return next(new AppError("there is an error somewhere in the order creation"))
})
exports.createOrderWithAccount=catchAsync(async(req,res,next)=>{
        const orderItems=req.body.orderItems;
        var  itemsPrice=0;
        await asyncForEach(orderItems,async(el)=>{
            const product=await Product.findById(el.product)
            itemsPrice+=(product.price*el.qty);
        })
      
        const theOrderedOrder={
            user:req.user,
            orderItems:req.body.orderItems,
            itemsPrice,
            email:req.user.email,
            shipping:{
                address: req.body.address,
                city: req.body.city,
                postalCode: req.body.postalCode
            },
            phoneNumber:req.user.phoneNumber
        }
        console.log(theOrderedOrder);
      
        const order=await Order.create(theOrderedOrder)

        await asyncForEach(theOrderedOrder.orderItems,async(el)=>{
            await  ProductDetails.updateOne(
                {_id: el.product_details},
                {$inc: { "countInStock" : - el.qty}}
            )
        })
    if (order){

        res.status(200).json({
            status:"success",
            data:{
                order
            }
        })
    }else return next(new AppError("there is an error somewhere in the order creation"))
})




exports.cancelOrder=catchAsync(async (req,res,next)=>{
    const order_id=req.params.order_id;
    const order=await Order.findById(order_id)
    await Order.updateOne({_id:order_id}, {
        "$set":{"canceled":true}
    })
    await asyncForEach(order.orderItems,async(el)=>{
        await  ProductDetails.updateOne(
            {_id: el.product_details},
            {$inc: { "countInStock" :  el.qty}}
        )
    })
    res.status(200).json({
        status:'success',
        message:'commande annulée'
    })
})

exports.validateOrder=catchAsync(async (req,res,next)=>{
    const order_id=req.params.order_id
    const order=await Order.updateOne(
        {_id:order_id},
        {"$set":{"validated":true}}
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

exports.confirmDeliveryAndPayment=catchAsync(async (req,res,next)=>{
    const order_id=req.params.order_id
    
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

