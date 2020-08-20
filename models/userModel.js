const crypto=require('crypto');
const validatorLib=require('validator')
const slugify=require('slugify')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please it is required'],
        validate: [function(value){
            const l=value.split(' ').join('')
            return validatorLib.isAlpha(l);
        },'name should only contain letters']
    },
    role:{
        type:String,
        enum:['user','manager','admin'],
        default:'user'
    },
    email:{
        type:String,
        required:[true,'please it is required'],
        unique:true,
        lowercase:true,
        validate:[validatorLib.isEmail,'respect email properties']
    },
    phoneNumber:{
        type:String,
        required: [true, 'phone number is required'],
        minlength:8,
        maxlength:8,
        validate:{
            validator:function(inputtxt){
                var numbers = /^[0-9]+$/;
                return inputtxt.value.match(numbers)
            }
        }
    },
    photo:String,
    password:{
        type:String,
        required:[true,'please it is required'],
        minlength:[8,'password not less than 8 characters'],
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'please it is required'],
        minlength:[8,'password not less than 8 characters'],
        validate:{
            validator:function(value){
                return value===this.password
            },
            message:'does not match with the password'
        }
    },
    passwordResetToken:String,
    passwordResetExpires:Date,
    passwordChangedAt:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    },
    address: {
         type: String, 
         required: true
         },
  city: { 
      type: String,
       required: true },
  postalCode: {
       type: String, 
       required: true 
    },
  country: { 
      type: String, 
    required: true },

})
userSchema.pre(/^find/,function(next){
    this.find({active : {$ne:false}});
    next();
})
//name,email,photo,password,passwordConfirm
userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew){
        return next();
    }
    this.passwordChangedAt=Date.now()-1000;
    next();

})
userSchema.pre('save',async function(next){
    if (!this.isModified('password')) return next();
    this.password= await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    next();
})

userSchema.methods.correctPassword= async function(candidatePassword, userPassword){
return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changedPasswordAfter=function(JWTTimestamp){
    let changedTimestamp; 
    if(this.passwordChangedAt){
         changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        console.log(changedTimestamp,JWTTimestamp)
    }
    return JWTTimestamp<changedTimestamp;
}


userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    console.log({resetToken},this.passwordResetToken);
    this.passwordResetExpires=Date.now()+10*60*1000;

    return resetToken;
}
const User=mongoose.model('User',userSchema)

module.exports=User;