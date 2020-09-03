const mongoose=require('mongoose')

const claimSchema = new mongoose.Schema({
  title: { type: String, required: true , unique:true},
  type: {
      type: String,
      enum:['produit','delais'],
    default:'Men'
  },
  description: { type: String, required: true },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:[true,'Claim must belong to a user']
},
});


claimSchema.pre(/^findBy/,function(next){
    
   
     
    this.populate({
        path:'user',
        select:'email '
    })
    next();
})
const Claim = mongoose.model('Claim', claimSchema);




module.exports=Claim