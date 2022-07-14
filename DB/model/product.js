const mongoose = require('mongoose');
const bycrpt = require('bcrypt');
const CryptoJS = require("crypto-js");

const productSchema = new mongoose.Schema({
    productTitle: {
        type: String,
        required: true
    },
    productDesc: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        default: []
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    hidden:{
        type: Boolean,
        default: false
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'comment',
        default: []
    }],
    wishlists:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        default: []
    }],
    QRCode: {
        type: String,
        required: false
    }
}, {
    timestamps: true
})

productSchema.pre(`findOneAndUpdate`, async function () {
    console.log(this.model);
    console.log(this.getQuery());
    const hookData = await this.model.findOne(this.getQuery()).select('__v')
    console.log({ hookData });
    this.set({ __v: hookData.__v + 1 })
})

const productModel = mongoose.model('product', productSchema);
module.exports = productModel;