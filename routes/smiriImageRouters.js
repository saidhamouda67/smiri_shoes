const express=require('express')
const router=express.Router();
const upload=require('../utils/uploadImages')

router.route('').get(async (req,res,next)=>{
    res.status(200).json({
        images:process.env.SMIRI_IMAGE.split(",")
    })
}).post(upload.array('images',4),async(req,res,next)=>{
    var a=[];
   req.files.forEach(element=>{
       a.push(element.path);
   })

   process.env.SMIRI_IMAGE=a.join(",");
    res.status(200).json({
        status:"success",
        images:process.env.SMIRI_IMAGE
    })
})
module.exports=router;  