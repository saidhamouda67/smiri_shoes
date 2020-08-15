const AppError=require('./../utils/appError')
const handleCastErrorDB=(error)=>{
  const message=`Invalid ${error.path}: ${error.value}`
  
  return new AppError(message, 400);
}

const handleJwtExpiredError=()=>{
    return new AppError('your token has expired login again',401)
}
const handleJwtError=()=>{
    return new AppError('Invalid token, please login again! ',401);
}
const handleDuplicateFieldsDB=(err)=>{
    const value=err.errmsg.match(/"(.*?)"/g)
    console.log(value[0]);
    const message='duplicate fields value '+value[0]+' please use another value';

    return new AppError(message,400)
}

const handleValidationErrorDB=(err)=>{
    const errors=Object.values(err.errors).map(e=>e.message).join(' - ');
    const message="invalid input data : "+errors;
    return new AppError(message,400);
}
const sendErrorDev=(err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd=(err,res)=>{
    //operational, trusted error: send message to client
if(err.isOperational){
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    })

    //Programm g or other unknown error: don't leak error details
}else{
    //1)log error
    console.error('ERROR', err);
    

    //2)send generic message
    res.status(500).json({
        status:'error',
        message:'something went wrong'
    })
}


}
module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.status=err.status || 'erroroo';

    if(process.env.NODE_ENV=='development'){
        sendErrorDev(err,res);
    }else if (process.env.NODE_ENV=='production'){
        let error={...err};
        if(error.name==='CastError')error=handleCastErrorDB(error);
        if(error.code===11000) error=handleDuplicateFieldsDB(error);
        if(error.name==='ValidationError')error=handleValidationErrorDB(error);
        if(error.name==='JsonWebTokenError')error=handleJwtError(error);
        if(error.name==='TokenExpiredError')error=handleJwtExpiredError(error);
        
        sendErrorProd(error,res);
    } 

}