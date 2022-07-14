const mongoose = require('mongoose');
const bycrpt = require('bcrypt');
const CryptoJS = require("crypto-js");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
    ,
    password: {
        type: String,
        required: true
    },
    profile_picture: String,
    cover_pictures: Array,
    loginStatus: { 
        type: Boolean, 
        default: false 
    },
    confirmed: {
        type: Boolean, 
        default: false 
    },
    role: { 
        type: String, 
        default: 'User' 
    },
    Qr_code:{
        type: String
    },
    blocked :{
        type: Boolean,
        default: false
    },
    wishList:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'product',
        default: []
    }],
    isDeleted:{
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

userSchema.pre(`findOneAndUpdate`, async function () {
    console.log(this.model);
    console.log(this.getQuery());
    const hookData = await this.model.findOne(this.getQuery()).select('__v')
    console.log({ hookData });
    this.set({ __v: hookData.__v + 1 })
})

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;