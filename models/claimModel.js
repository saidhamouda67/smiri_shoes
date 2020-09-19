const mongoose=require('mongoose')
const validatorLib=require('validator')

const claimSchema = new mongoose.Schema({
  title: { type: String, required: true },

  description: { type: String, required: true },

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
  lowercase:true,
  validate:[validatorLib.isEmail,'respect email properties']
},
});



const Claim = mongoose.model('Claim', claimSchema);




module.exports=Claim