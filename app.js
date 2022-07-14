const express  = require('express');
//import  express  from 'express';
 const connectDB = require('./DB/connection');
 const schedule = require('node-schedule');
 const fs = require("fs");
// import connectDB from './DB/connection'
require("dotenv").config();
const path= require("path")
const  indexRouter  = require('./modules/index.router');
const { createInvoice } = require('./services/createInvoice');
// const { sendEmail } = require('nodejs-nodemailer-outlook');
const {sendEmail} = require('./services/email');
const app = express()
const port =process.env.PORT
app.use(express.json())
app.use("/api/v1/uploads",express.static(path.join(__dirname,'./uploads')))
app.use("/api/v1/auth",indexRouter.authRouter ) // here we used base url to improve performance 
app.use("/api/v1/user",indexRouter.userRouter )
app.use("/api/v1/product",indexRouter.productRouter )
// const invoice = {
//     shipping: {
//         name: "John Doe",
//         address: "1234 Main Street",
//         city: "San Francisco",
//         state: "CA",
//         country: "US",
//         postal_code: 94111
//     },
//     items: [
//         {
//             userName: "Mahmoud",
//             Email: "mm@gmail.com",
//             Age: 22,
//             Gender: "Male",
//             phone: "01142951602"
//         },
//         {
//             userName: "Rana",
//             Email: "rana@gmail.com",
//             Age: 24,
//             Gender: "Female",
//             phone: "01142951608"
//         },
//     ],
//     subtotal: 8000,
//     paid: 0,
//     invoice_nr: 1234
// };
// createInvoice(invoice, path.join(__dirname, './uploads/PDF/invoice.pdf'))

// schedule.scheduleJob('* * * * * *', function(){
//     console.log("hi");
//     // sendEmail('hajardebian@outlook.com' , `<p>please check the attachment below</p>`, [
//     //     {
//     //         content: fs.readFileSync(path.join(__dirname, './uploads/PDF/invoice.pdf')).toString("base64"),
//     //         filename: "attachment.pdf",
//     //         type: "application/pdf",
//     //         disposition: "attachment"
//     //     }
//     // ])
//   });
connectDB();
app.listen(port , ()=>{
    console.log(`Runinng..... on port ${port}`);
})