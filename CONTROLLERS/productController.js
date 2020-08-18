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
    const product=await Product.findById(product_id);
    while(details=await ProductDetails.findOneAndDelete({product})){
        continue;
    }
})