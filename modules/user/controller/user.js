const userModel = require("../../../DB/model/user")
const bcrypt =require(("bcryptjs"))



////An API for the user to view his/her profile (account data)
const displayProfile=async (req,res)=>{
  try {
    const user= await userModel.findById(req.user._id);
res.status(200).json({message:"Done",user})
  } catch (error) {
    res.status(500).json({message:"catch error",error})
  }
}


///through this API  a user ca assign himself a profile picture
const profilePicture=async (req,res)=>{
    try {
        if (req.fileErr) {
            res.status(400).json({message:"in-valid format"})
        } else {
            const imageURL =[];
            req.files.forEach(file => {
                imageURL.push(`${req.finalDestination}/${file.filename}`)
            });
            const user = await userModel.findByIdAndUpdate(req.user._id,{profilePic:imageURL},{new:true})
            res.status(200).json({message:"Done",user})
        }
    } catch (error) {
        res.status(500).json({message:"catch error",error})
    }
}


////though this API a user can assign himself a cover picture
const profileCoverPicture=async (req,res)=>{
    try {
        if (req.fileErr) {
            res.status(400).json({message:"in-valid format"})
        } else {
            const imageURL =[];
            req.files.forEach(file => {
                imageURL.push(`${req.finalDestination}/${file.filename}`)
            });
            const user = await userModel.findByIdAndUpdate(req.user._id,{coverPic:imageURL},{new:true})
            res.status(200).json({message:"Done",user})
        }
    } catch (error) {
        res.status(500).json({message:"catch error",error})
    }
}


////A user can update (change) their password through this API
const updatePassword=async (req,res)=>{
 try {
    const {oldPassword,newPassword}= req.body;
    if (oldPassword == newPassword) {
        res.status(409).json({message:"sorry, you have to make new password"})
    } else {
        const user= await userModel.findById(req.user._id);
        const match= await bcrypt.compare(oldPassword,user.password);// return true or false
        if (!match) {
         res.status(400).json({message:"in-valid old password"})
        } else {
         const hashedPassword = await bcrypt.hash(newPassword,parseInt(process.env.saltRound));
         await userModel.findByIdAndUpdate({_id:user._id},{password:hashedPassword});
         res.status(200).json({message:"Done"})
        }
    }
  
 } catch (error) {
    res.status(500).json({message:"catch error",error})
 }

}


////when a user wishes to update any of their profile data they can user this API
const updateProfile = async (req, res) =>{
   try {
    const {email , password ,userName} = req.body;
    const user = await userModel.findById(req.user._id);
    if(!user.emailConfirm){
        res.status(400).json({message:"please confirm your email first"});
    }else{
        const hashPassword = await bcrypt.hash(password, parseInt(process.env.saltRound));
        if(email != user.email){
           // confirmEmail();
            await userModel.findByIdAndUpdate({_id:user._id}, { password: hashPassword} , {email:email} , {userName:userName});
            res.status(200).json({ message: "Done, Email is updated But you must confirm it to login" });
        }else{
           // await userModel.findByIdAndUpdate(user._id, { password: hashPassword} , {email:email} , {firstName:firstName} , {lastName:lastName});
            res.status(400).json({ message: "sorry, you have to enter new email ,this email is already exist" });
        }
    }
   } catch (error) {
    res.status(500).json({ message: "catch error", error });
   }
}

const endPoint = require("../user.endPoint")



////Any Admin within the system is privileged to delete any user account through this API
const deleteUserByAdmin = async(req , res) => {
    try {
        const {userId} = req.params;
        const user = await userModel.findOne({ _id: userId });
        if (/*user.role == endPoint.notAllowed*/req.user.role=="Admin") {
            res.status(401).json({ message: "sorry you can't delete an Admin" })
        } else {
            await userModel.findOneAndDelete({_id:userId} , {new:true})
            sendEmail(user.email, `<p> your account has been deleted</p>`)
            res.status(200).json({ message: "Done", user })
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error });
    }
}


////A user can delete his profile through this API
const deleteAccountByUser = async(req , res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if(user){
            await userModel.findOneAndDelete(req.user._id , {new:true})
            sendEmail(user.email, `<p> your account has been deleted</p>`)
            res.status(200).json({ message: "Done", user })
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error });
    }
}


///an admin can soflt delete a user account (make it disabled) by this API
const softDeleteUser = async(req, res) =>{
    const {userId} = req.params;
    const user = await userModel.findOne({ _id: userId });
    if (user.role == endPoint.notAllowed) {
        res.status(401).json({ message: "sorry u can't delete an Admin" });
    } else {
        await userModel.findByIdAndUpdate(user._id, { isDeleted: true })
        sendEmail(user.email, `<p> your account has been deleted</p>`)
        res.json({ message: "Done", user })
    }

}

///Pagination to get all the users within the system
const getAllUsers = async(req , res) =>{
    const {page , size } = req.query
    const {limit , skip} = paginate(page , size)
    const users = await userModel.find({}).limit(limit).skip(skip).populate([
        {
            path: 'wishlist',
            select: 'productTitle productDesc productPrice likes comments wishlists isDeleted hidden'
        }
    ])
    res.status(200).json({message:"Done" , users});
}


///pagination to get all the products within the system
const getAllProducts = async(req , res) =>{
    const {page , size } = req.query
    const {limit , skip} = paginate(page , size)
    const products = await productModel.find({}).limit(limit).skip(skip).populate([
        {
            path: 'comments',
            select: 'commentedBy replies productId commentLikes'
        },
        {
            path: 'wishlist',
            select: 'userName firstName lastName email wishlist profilePic coverPic isDeleted isBlocked emailConfirm role'
        }
    ])
    res.status(200).json({message:"Done" , products});
}


///pagination to get all the comments
const getAllComments = async(req , res) =>{
    const {page , size } = req.query
    const {limit , skip} = paginate(page , size)
    const comments = await commentModel.find({}).limit(limit).skip(skip).select('replies')
    res.status(200).json({message:"Done" , comments});
}

const schedule = require('node-schedule');
const {sendEmail} = require('../../../services/email');
const fs = require("fs");
const path = require("path");
const { createInvoice } = require('../../../services/createInvoice');


///creating a pdf containing all the products created today
const invoice = async(req , res) =>{
    // const products = await productModel.find({});
    // const invoiceData = {
    //     items: products,
    // };
    // createInvoice(invoiceData, path.join(__dirname, '../../../uploads/PDF/allProducts.pdf'))
    // res.status(201).json({message:"Done" , link: req.protocol + '://' + req.headers.host + '/api/v1/admin/uploads/pdf/allUsers.pdf'  , products})
}


///sending that pdf through email to the admins as an attachment
schedule.scheduleJob('59 59 23 * * *', async function(){
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);
    const products = await productModel.find({created_on: {$gte: start, $lt: end}});
    const user = await userModel.find({role:'Admin'});
    const invoiceData = {
        items: products,
    };
    createInvoice(invoiceData, path.join(__dirname, '../../../uploads/PDF/allProducts.pdf'))
    // res.status(201).json({message:"Done" , link: req.protocol + '://' + req.headers.host + '/api/v1/admin/uploads/pdf/allUsers.pdf'  , products})
    sendEmail(`${user.email}` , `<p>please check the attachment below</p>`, [
        {
            content: fs.readFileSync(path.join(__dirname, '../../../uploads/PDF/allProducts.pdf')).toString("base64"),
            filename: "attachment.pdf",
            type: "application/pdf",
            disposition: "attachment"
        }
    ])
  });

module.exports={
    displayProfile,
    profilePicture,
    profileCoverPicture,
    updatePassword,
    updateProfile,
    deleteUserByAdmin,
    deleteAccountByUser,
    softDeleteUser,
    getAllUsers,
    getAllProducts,
    getAllComments,
    invoice
}