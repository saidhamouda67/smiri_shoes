const express=require('express')
const router=express.Router();
const upload=require('../utils/uploadImages')
const smiriImageModel=require('../models/smiriImageModel');
const smiriModel = require('../models/smiriImageModel');
const fs=require('fs')
router.route('').get(async (req,res,next)=>{
    const images=await smiriModel.find();
    
    console.log("")
    res.status(200).json({
        images:images[0]
    })
}).post(upload.array('images',4),async(req,res,next)=>{
    var a=[];
   req.files.forEach(element=>{
       a.push(element.path);
   })
   const images=await smiriModel.find();
   if(images[0]){
   var lesImages=[];
   
   lesImages.push(images[0].first_image)
   lesImages.push(images[0].second_image)
   lesImages.push(images[0].third_image)
   lesImages.push(images[0].fourth_image)
   lesImages.forEach(element => {
    fs.unlink(element, (err) => {
             
        //file removed
      })
   });
}
console.log(a);
  const k= await smiriImageModel.findByIdAndUpdate("600084364d24b1010cbe317e",{
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