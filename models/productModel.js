const mongoose=require('mongoose')

const productSchema = new mongoose.Schema({

  color: {type: String, required: true},
  name: { type: String, required: true , unique:true},
  brand: { type: String, required: true },
  category: {
      type: String,
      enum:['Women','Men','Kids'],
    default:'Men'
  },

  price: {type: Number, required: true},
  oldPrice: {type: Number, required: false},
  description: { type: String, required: true },

  ratingsAverage: {
    type:Number,
    default:4.5,
    min:[1,'min average is 1.0'],
    max:[5,'max average is 5.0'],
    set:val=>Math.round(val*10)/10
},
ratingsQuantity:{
    type:Number,
    default:0
},
images:[String],
  createdAt:{
    type:Date,
    default:Date.now(),
    select: false 
}
},
{
toJSON: {virtuals:true},
toObject:{virtuals:true}
}
);
productSchema.index({price: 1})
productSchema.virtual('reviews',{
  ref:'Review',
  foreignField:'product',
  localField:'_id'
})
const productDetailsSchema=new mongoose.Schema({
product:{ type:mongoose.Schema.ObjectId,
    ref:'Product',
        required:[true,'Product details must belong to product']
    },    
    size: { type: Number, required: true},
    countInStock : {type: Number, required: true}

})

const Product = mongoose.model('Product', productSchema);
const ProductDetails = mongoose.model('Product_details', productDetailsSchema);




module.exports={Product,ProductDetails}





