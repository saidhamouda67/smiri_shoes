const mongoose=require('mongoose')
const dotenv=require('dotenv');

process.on('uncaughtException',err=>{
    console.log("ungaught excepetion shutding down...");
    console.log(err.name, err.stack);
  

})
dotenv.config({path : './conf.env'})
const app=require('./app');
const http=require('http').createServer(app);
const io=require('socket.io')(http);

const finalFunc = require('./utils/createAdminOneTime');

     const DB=process.env.DATABASE_CONNECTION_LINK.replace('<password>','v8UtrgwRHQaaE8SP');
//const DB=process.env.LOCAL_DATABASE.replace('<password>','v8UtrgwRHQaaE8SP');

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(async (connection)=>{
console.log('database connected successfully')
await finalFunc()
})

const port=process.env.PORT;

const server=http.listen(port,()=>{
    console.log(`runing on port ${port}`);

    io.on('connection',(socket)=>{
            socket.on('notificationSend',(notifDetails)=>{
                socket.broadcast.emit('notificationSend',notifDetails)
            })
    })
})


process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    console.log('UNDHANDLER REJECTION ! , Shuting down...');
    server.close(()=>{
        process.exit(1);

    })
})
//


