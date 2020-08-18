const mongoose=require('mongoose')
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    loggedInUser: { 
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  rating: { type: Number, default: 0, required: true },
  category: {
      type: String,
      enum:['Women','Men','Kids'],
    default:'Men'
  },
  description: { type: String, required: true },

  numReviews: { type: Number, default: 0, required: true },
  reviews: [reviewSchema],
});

const productDetailsSchema=new mongoose.Schema({
product:{ type:mongoose.Schema.ObjectId,
    ref:'Product',
        required:[true,'Product details must belong to product']
    },    
    size: { type: Number, required: true},
    countInStock : {type: Number, required: true},
    price: {type: Number, required: true},
    images:[String],
    color: {type: String, required: true},


})

const Product = mongoose.model('Product', productSchema);
const ProductDetails = mongoose.model('Product_details', productDetailsSchema);

reviewSchema.pre('save',function(next){
    if (this.loggedInUser){
        this.name=this.loggedInUser.name;
        this.loggedInUser=undefined;
    }
    next();

})

module.exports={Product,ProductDetails}





