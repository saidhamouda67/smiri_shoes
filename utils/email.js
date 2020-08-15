const nodemailer=require('nodemailer');
const sendEmail=async options=>{
    //1)create a transporter
//ex:gmail
const transporter=nodemailer.createTransport({
    host: 'smtp.googlemail.com', // Gmail Host
        port: 465, // Port
        secure: true, // this is true as port is 465
        auth: {
            user: 'smiri.shoes.tunis', // generated ethereal user
            pass: 'abcABC123.', // generated ethereal password
        },
    //activate the gmail "less secure app option"
})
// const transporter=nodemailer.createTransport({
//     host:process.env.EMAIL_HOST,
//     port:process.env.EMAIL_PORT,
//     auth:{
//         user:process.env.EMAIL_USERNAME,
//         pass:process.env.EMAIL_PASSWORD
//     }
// })
    //2)define the email
    const mailOptions={
        from:'smiri.shoes.tunis@gmail.com',
        to:options.email,
        subject:options.subject,
        text:options.message,
        // html:

    }

    //3)actually send the email
    await transporter.sendMail(mailOptions);
}


module.exports=sendEmail;