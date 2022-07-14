const mongoose = require('mongoose');
const bycrpt = require('bcrypt');
const CryptoJS = require("crypto-js");

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    comment_By: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true
    }],
    product_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'product',
        required: true
    }],
    replies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'comment'
    }],
    commentLikes: [{
         type: mongoose.Schema.Types.ObjectId, ref: "User" 
    }]
}, {
    timestamps: true
})

commentSchema.pre(`findOneAndUpdate`, async function () {
    console.log(this.model);
    console.log(this.getQuery());
    const hookData = await this.model.findOne(this.getQuery()).select('__v')
    console.log({ hookData });
    this.set({ __v: hookData.__v + 1 })
})

const commentModel= mongoose.model('comment', commentSchema);
module.exports = commentModel;