//review /rating /createdAt / ref to tour /ref to user
const mongoose=require('mongoose')
const {Product}=require('./productModel')
const reviewSchema=new mongoose.Schema({

    review: {
        type: String,
        required:[true, 'Review can not be empty:!']
    },
    rating:{
        type:Number,
        min: 1,
        max:5
    },
    createdAt:{ 
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Review must belong to a user']
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:[true,'Review must belong to a product']
    }    
},
    {
    toJSON: {virtuals:true},
       toObject:{virtuals:true}
})

reviewSchema.index({ product: 1, user: 1 }, {unique: true })


reviewSchema.pre(/^find/,function(next){
    
   
     
    this.populate({
        path:'user',
        select:'name photo '
    })
    next();
})

reviewSchema.statics.calcAverageRatings=async function(product){
    const stats=await this.aggregate([
        {
            $match:{product}
        },
        {
            $group:{
                _id:'$product',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ]);
    console.log(stats);
    if(stats.length>0)
    await Product.findByIdAndUpdate(product,{
        ratingsQuantity:stats[0].nRating,
        ratingsAverage:stats[0].avgRating
    })
    else 
    await Product.findByIdAndUpdate(product,{
        ratingsQuantity:0,
        ratingsAverage:4.5
    })
}



reviewSchema.pre(/^findOneAnd/,async function(next){
this.r=await this.findOne();

next();
})

reviewSchema.post(/^findOneAnd/,async function(){
    await this.r.constructor.calcAverageRatings(this.r.product);
})
reviewSchema.post('save',function(){
//this points to current reviews
this.constructor.calcAverageRatings(this.product);
})

const Review=mongoose.model('Review',reviewSchema)





module.exports=Review;


//POST /tour/3232323/reviews
//GET /tour/3232323/reviews
//GET /tour/3232323/reviews/32324