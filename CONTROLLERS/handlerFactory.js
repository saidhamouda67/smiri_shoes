const catchAsync=require('./../utils/ErrorCatchAsync')
const AppError=require('./../utils/appError')
const APIFeatures=require('./../utils/apiFeatures')


exports.deleteOne=Model=>catchAsync( async (req,res,next)=>{

   
    const doc=await Model.findByIdAndDelete(req.params.id)
 
    if(!doc){
        return next(new AppError('No document found with this Id',404))
    }
    res.status(204).json({
        status:'success',
        data:{
            doc
        } 
    })


})

exports.updateOne= Model=> catchAsync(async (req,res,next)=>{
    if(req.files){
        let images=[]
        req.files.forEach(element => {
            images.push(element.path)
        });
        req.body.images=images;
    }
    const doc=await Model.findByIdAndUpdate(req.params.id, req.body,
        {
            new:true,
            runValidators:true
        })

        if(!doc){
            return next(new AppError('doc not found ',404))
        }
    res.status(200).json({
        status:'success',
        data:{
            data:doc
        }
    })


})


exports.createOne=Model=>catchAsync(async (req,res,next)=>{
    if(req.files){
        let images=[]
        req.files.forEach(element => {
            images.push(element.path)
        });
        req.body.images=images;
    }
    const newDoc=  await Model.create(req.body);

    
    res.status(201).json({
        status:'success',
        data:{
            data:newDoc
        }
    })
  })
  

exports.getOne=(Model,populateOptions)=> catchAsync(async (req,res,next)=>{
    let doc= Model.findById(req.params.id)
    if (populateOptions)
    doc=doc.populate(populateOptions);
    
    doc=await doc;
    
    if(!doc){
        return next(new AppError('doc not found with that id',404))
    }
    res.status(200).json({
        status:'success',
        data:{
            data:doc
        }
       
    })
  
    })


    exports.getAll=(Model,populateOptions)=>catchAsync(async (req,res,next)=>{


        let filter={}
        if(req.params.id_product) filter={id:req.params.id_product}
        var theDocument=Model.find(filter)
        if (populateOptions)
        theDocument=theDocument.populate(populateOptions);
        const features=new APIFeatures(theDocument,req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();
        
        //EXECUTE THE QUERY
        const doc=await features.query;
    
        //SEND RESPONSE
        res.status(200).json({
            status:'success', 
            results:doc.length,
            requestedAt:req.requestTime,
            data:{
                data:doc
            }
    
        })
    
        })