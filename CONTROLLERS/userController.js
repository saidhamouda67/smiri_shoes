const User=require('./../models/userModel')
const catchAsync=require('./../utils/ErrorCatchAsync');
const AppError=require('./../utils/appError');
const factory=require('./handlerFactory')


const filterObj=(obj,...allowedFields)=>{
    const newObje={};
    
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)){
            newObje[el]=obj[el]
        }
    })
    return newObje;
}
exports.getAllUsers=factory.getAll(User);
exports.getUser=factory.getOne(User);

exports.createUser=(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'This route is not yed defined'
    })
}

//do not update passwords with this
exports.updateUser=factory.updateOne(User);

exports.deleteUser=factory.deleteOne(User);
exports.updateMe=catchAsync(async (req,res,next)=>{

    //1)create error if user posts a password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('this route is not for password update , please the password update route',400))
    }
    //2)filtre out unwanted fields
    const filteredBody=filterObj(req.body,'name','email','city','phoneNumber');
    console.log("kkkkkkkkkkkkkkkk",filteredBody)
    //3)update user
    const updatedUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new: true,runValidators:true
    });
    res.status(200).json({
        status:'success',
       data:{
           user:updatedUser
       }
    })
})


exports.deleteMe=catchAsync(async(req,res,next)=>{
   await User.findByIdAndUpdate(req.user.id,{active:false});
   res.status(204).json({
       status:'success',
       data:null
   })
})

exports.affectRoleToUser=catchAsync(async(req,res,next)=>{
    const predifined_roles=['user','manager','admin'];
    console.log(req)
    if(!predifined_roles.includes(req.body.role)){
        return next(new AppError(' there is no role like this ',403))
    }
    const dedicated_user= await User.findByIdAndUpdate(req.body.dedicated_user_id,{role:req.body.role});
    res.status(204).json({
        status:'success',
        data:{
            user:dedicated_user
        }
    })
})


exports.getMe=(req,res,next)=>{
    req.params.id=req.user.id;
    next();
}