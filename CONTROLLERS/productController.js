const User=require('./../models/userModel')
const catchAsync=require('./../utils/ErrorCatchAsync');
const AppError=require('./../utils/appError');
const factory=require('./handlerFactory')
const {Product,ProductDetails}=require('./../models/productModel')

exports.getAllProducts=factory.getAll(Product);
exports.getProduct=factory.getOne(Product);

exports.AddProduct=factory.createOne(Product)
exports.DeleteProduct=factory.deleteOne(Product);
exports.AddProductDetails=catchAsync(async(req,res,next)=>{
    const product_id=String(req.params.id_prod);
    let product=Product.findById(product_id);
    try {
        product=await product
    } catch (error) {
        return next(new AppError('product does not exist'))

    }
    
    const newProductDetails=await ProductDetails.create({
        product,
        size:req.body.size,
        countInStock:req.body.countInStock,
        price:req.body.price,
        images:req.body.images,
        color:req.body.color
    })
    if (newProductDetails)
    res.status(200).json({
        status:'success',
        message:'product details created'
    })

})

exports.DeleteRelatedDetails=catchAsync(async (req,res,next)=>{
    const product_id=req.params.id_prod;
    console.log(product_id)
    const product=new Product({
        "_id":product_id
    })
    console.log("prod",product)
    try{
    while(details=await ProductDetails.findOneAndDelete({product})){
        console.log("details",details)
    }
}catch(error){
    return next(new AppError(error))
}

res.status(200).json({
    status:'success'
})
})
exports.updateProduct=catchAsync(async (req,res,next)=>{

    //1)create error if user posts a password data
    console.log(req.body);
    console.log(req.params.id)
    //3)update product
    const updatedProduct=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new: true,runValidators:true
    });
    res.status(200).json({
        status:'success',
       data:{
           product:updatedProduct
       }
    })
})
exports.updateProductDetails=catchAsync(async (req,res,next)=>{

    //create error if user posts a product cuz products modified in the link route
    if (req.body.product ){
        return next(new AppError("go to link product details route to modify this"))
    }
    //3)update product
    const updatedProductDetails=await ProductDetails.findByIdAndUpdate(req.params.id,req.body,{
        new: true,runValidators:true
    });
    res.status(200).json({
        status:'success',
       data:{
           productDetails:updatedProductDetails
       }
    })
})


exports.LinkDetails=catchAsync(async(req,res,next)=>{
    const id_product=req.params.id_prod;
    const id_details=req.params.id_details;
    const details=await ProductDetails.findById(id_details);
    const alreadyProductId=await details.product._id
    const dedicated_product=await Product.findById(id_product)
    const theProduct=await Product.findById(alreadyProductId)
    console.log('already productId',alreadyProductId)
    console.log(theProduct)
    if (!theProduct){
        details.product=dedicated_product
        const newDetails=await ProductDetails.findByIdAndUpdate(id_details,details,
            {
            new:true,
            runValidators:true
        })
        console.log(details)
    }else{
        const newProductDetails=await ProductDetails.create({
            size:details.size,
            price:details.price,
            countInStock:details.countInStock,
            product:dedicated_product,
            color:details.color
        })
        console.log(newProductDetails)
    }

    res.status(200).json({
        status:'success'
    })
})

exports.getRelatedDetails=catchAsync(async (req,res,next)=>{
    const product=await Product.findById(req.params.id_prod)
    const allProductDetails=await ProductDetails.find({
        product
    })
    res.status(200).json({
        status:'success',
        data:{
            allProductDetails
        }
    })
})

