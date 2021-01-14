const express = require('express');
const morgan=require('morgan');
const AppError=require('./utils/appError')
const globalErrorHandler=require('./CONTROLLERS/errorController')
const rateLimit=require('express-rate-limit');
const app=express();
const userRouter=require('./routes/userRouters')
const claimRouter=require('./routes/claimRouters')
const productRouter=require('./routes/productRouters')
const smiriImageRouter=require('./routes/smiriImageRouters')
const orderRouter=require('./routes/orderRouters')
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean')
const cookieParser=require('cookie-parser');
var bodyParser = require('body-parser')
const  cors = require('cors')

app.use(bodyParser.json())
//app.use(cors);


app.use(helmet())

if(process.env.NODE_ENV=='development'){
    app.use(morgan('dev'))

}

const limiter=rateLimit({
    max:300,
    windowMs:60*60*1000,
    message:'Too many requests from this ip, please try again in an hour!'
})

app.use('/api',limiter);
//body parser, reade in data from body into req.body
app.use(express.json({
    limit:'10kb'
}));
app.use(cookieParser());

//data sanitization againt nosql query injection
app.use(mongoSanitize())



//data sanitation xss$
app.use(xss())

app.use((req,res,next)=>{
    req.requestTime=new Date().toString();
    console.log(req.cookies);
    
    next();
}) 
 
app.use('/uploads',express.static('uploads'))


 app.use('/api/v1/users',userRouter);
 app.use('/api/v1/orders',orderRouter);
 app.use('/api/v1/products',productRouter);
 app.use('/api/v1/claims',claimRouter);
 app.use('/api/v1/image-smiri',smiriImageRouter);



 app.all('*',(req,res,next)=>{

   
    const message=`Can't find ${req.originalUrl} on this server bebe`


    next(new AppError(message) );
 })

 app.use(globalErrorHandler);
 module.exports=app;