const smiriModel = require('../models/smiriImageModel')
const User = require('../models/userModel')
const catchAsync=require('./ErrorCatchAsync')
const createAdmin=catchAsync(async ()=>{
    const theAdmin=await User.create({
    name:process.env.NAME_ADMIN,
    email:process.env.EMAIL_SMIRI,
    password:process.env.PASSWORD_ADMIN,
    passwordConfirm:process.env.PASSWORD_ADMIN,
    address:"kram",
    city:"ok bebe",
    postalCode:"2025",
    country:"tunisia",
    phoneNumber:process.env.PHONENUMBER_ADMIN,
    role:'admin'
    })
    if(theAdmin) console.log('admin created')
})

const finalFunc=catchAsync(async()=>{
    const theUser=await User.findOne({email:process.env.EMAIL_SMIRI})
    if(theUser)  console.log("already exist"); else  await createAdmin() 



    const smiri_image=await smiriModel.create({
        first_image:"",
        second_image:"",
        third_image:"",
        fourth_image:""
    })
    if(smiri_image){
        console.log("smiri_image created");
    }
    
})
module.exports=finalFunc;
    