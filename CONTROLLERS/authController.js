const crypto=require('crypto')
const emailSend=require('./../utils/email')
const AppError=require('./../utils/AppError')
const jwt=require('jsonwebtoken')
const User=require('./../models/userModel')
const catchAsync=require('./../utils/ErrorCatchAsync')
const util=require('util')
const signToken=id=>{
   return  jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken=(user,statusCode,res)=>{
    const token=signToken(user._id);
    const cookieOptions=
    {
        expires:new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly:true
    }
    console.log()
    if(process.env.NODE_ENV==='production') cookieOptions.secure=true
    res.cookie('jwt',token,cookieOptions)
    user.password=undefined;
    res.status(statusCode).json({
    status:'success',
    token,
    data:{
        user
    }
})
}
exports.signup=catchAsync(async (req,res,next)=>{
const newUser=await User.create({
name:req.body.name,
email:req.body.email,
password:req.body.password,
passwordConfirm:req.body.passwordConfirm,
address:req.body.address,
city:req.body.city,
postalCode:req.body.postalCode,
country:req.body.country,
phoneNumber:req.body.phoneNumber
})


createSendToken(newUser,201,res);
})



exports.login=catchAsync(async (req,res,next)=>{
    const {email,password}=req.body;
    //check if email and password exist
    if(!email || !password){
     return    next (new AppError('Please provide email and password!',400))
    
    }


    //check if user exists && password is correct
    const user=await User.findOne({email}).select('+password')
    
    if(!user || !await user.correctPassword(password,user.password)){
        return next(new AppError('Incorrect email or password',401));
    }
    //if everything is okay , send the token to client 
    createSendToken(user,201,res);

})


exports.logout=catchAsync(async(req,res,next)=>{
    res.cookie('jwt','loggedout',{
        expires: new Date(Date.now()+10*1000),
        httpOnly:true
    })
    res.status(200).json({
        status: 'success'
    })
})
exports.protect=catchAsync(async(req,res,next)=>{
    //1)get the token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
         token=req.headers.authorization.split(' ')[1];
    }else if(req.cookies.jwt) token=req.cookies.jwt

    if(!token){
        return next(new AppError('you are not logged in! Please log in to get Access',401))
    }
    //2)verification the token
   const decoded=await util.promisify(jwt.verify)(token,process.env.JWT_SECRET);
    //3)check if user still exists
   const freshUser=await User.findById(decoded.id);
    if(!freshUser){
        return next(new AppError('the user belonging to this token does not exist anymore'))
    }
    


    //4)check if user changed password after token was issued
if(freshUser.changedPasswordAfter(decoded.iat))
    {
        return next(new AppError('User recently changed password! please log in again',401))
    }
    req.user=freshUser;
    //GRANT ACCESS TO PROTECTED ROUTE
next();
})

exports.restrictTo=(...roles)=>{
    return (req,res,next)=>{
        //roles is an array
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action',403))
        }
        next();
    }

   
}


exports.forgotPassword=catchAsync(async(req,res,next)=>{
    //1)Get User based on posted email
    const user=await User.findOne({email:req.body.email})
    if(!user){
        return next(new AppError('There is no user with that email address',404));
    }
    //2) the random reset token
    const resetToken=user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});


    //3)send it to user's email
    const resetURL=`https://smirishoes.tn/reset-password/${resetToken}`                                      
     //hne enti bch thezzou lpage html feha formulaire w yhot fih lmot de passe w yconfirmiih w te5ou mellien  elreset token 
     //w taadih lelroute mte3 reset token taw tal9ah felusers routes bro w tkamml khedmtek menghadi
    
    
    
     const message=`Forgot your password!! submit a PATCH request with your new passsword and passwordConfirm to : ${resetURL}\n if you didnt forget your password, please ignore this email`;
try {
    await emailSend({
        email:user.email,
        subject:'your password reset token (valid for 10min)',
        message
    });
    res.status(200).json({
        status:'success',
        message:'Token sent to email'
    })

} catch (error) {
  user.passwordResetToken=undefined;
  user.passwordResetExpires=undefined;
  await user.save({validateBeforeSave:false});
  console.log(error);
    return next(new AppError('there was an error sending the email, try again later',500));
}
})

exports.resetPassword=catchAsync(async(req,res,next)=>{
//1)get user based on the token

const hashedToken=crypto
.createHash('sha256')
.update(req.params.token)
.digest('hex');
console.log(hashedToken)
const user=await User.findOne({passwordResetToken: hashedToken,
    passwordResetExpires:{$gt:Date.now()}
})
if(!user)
return next(new AppError('Token is invalid or has expired',400))

user.password=req.body.password
user.passwordConfirm=req.body.passwordConfirm
user.passwordResetToken=undefined
user.passwordResetExpires=undefined
await user.save();


//2)if token has not expired , and there is user, set the new password


//3)update chaned password At property for the user



//4)log the user in, send jwt
createSendToken(user,200,res);

})


exports.updateMyPassword=catchAsync(async (req,res,next)=>{
//1)get user from collection
    const user=await User.findById(req.user.id).select('+password');
    const candidatePassword=req.body.password
//2)check if posted password is correct
    if(! await user.correctPassword(candidatePassword,user.password)){
        return next(new AppError('this password is not correct',401))
    }

//3)if so ,  update password
    const newPassword=req.body.newPassword
    user.password=newPassword;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();
//4)log user in, send jwt
createSendToken(user,200,res);

}
)






//only for rendered pages, no errors!
exports.isLoggedIn=catchAsync(async(req,res,next)=>{
    //1)get the token and check if it's there
    let token;
    if(req.cookies.jwt) {
    //2)verification the token
   const decoded=await util.promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
    //3)check if user still exists
   const freshUser=await User.findById(decoded.id);
    if(!freshUser){
        return next()
    }
    
    //4)check if user changed password after token was issued
if(freshUser.changedPasswordAfter(decoded.iat))
    {
        return next()
    }
//there is a logged in user
res.locals.user=freshUser
 return next();
    }

    next();
})
