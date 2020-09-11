const validatorLib=require('validator')
const mongoose=require('mongoose');
const shippingSchema = {
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true }
};


const orderItemSchema = new mongoose.Schema({
  qty: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  product_details:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product_details',
      required: true
  }
});


const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    orderedAt: {type: Date, default:  Date.now},
    orderItems: [orderItemSchema],
    shipping: shippingSchema,
    itemsPrice: { type: Number },
    shippingPrice: { type: Number, default: 5 },
    totalPrice: { type: Number },
    isDeliveredAndPaid: { type: Boolean, default: false },
    deliveredAndPaidAt: { type: Date },
    phoneNumber:{
      type:String,
      minlength:8,
      maxlength:8,
      validate:{
          validator:function(value){
              var numbers = /^[0-9]+$/;
              return value.match(numbers)
          }
      }
    },
    email:{
      type:String,
      unique:true,
      lowercase:true,
      validate:[validatorLib.isEmail,'respect email properties']
  },
     
    validated:{ type: Boolean, default:false}

  });


orderSchema.pre(/^find/,function(next){
  this.populate( {path: 'orderItems.product_details'})
  .populate({path:"orderItems.product", select:"name images price "})

  next();
})
orderSchema.pre('save',function(next){
  this.totalPrice=this.shippingPrice+this.itemsPrice
  next();
})

const orderModel = mongoose.model("Order", orderSchema);

module.exports=orderModel