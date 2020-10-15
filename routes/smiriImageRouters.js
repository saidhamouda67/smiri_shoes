const express=require('express')
const router=express.Router();
const upload=require('../utils/uploadImages')
const smiriImageModel=require('../models/smiriImageModel');
const smiriModel = require('../models/smiriImageModel');
router.route('').get(async (req,res,next)=>{
    const images=await smiriModel.find();
    
    
    res.status(200).json({
        images:images[0]
    })
}).post(upload.array('images',4),async(req,res,next)=>{
    var a=[];
   req.files.forEach(element=>{
       a.push(element.path);
   })
  const k= await smiriImageModel.create({
       first_image:a[0],
       second_image:a[1],
       third_image:a[2],
       fourth_image:a[3]
   })
   if(k)
    res.status(200).json({
        status:"success"
    })
})
module.exports=router;  