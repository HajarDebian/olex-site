const commentModel = require("../../../DB/model/comment");
const productModel = require("../../../DB/model/product");
const userModel = require("../../../DB/model/user");
const { endPoint } = require("../product.endPoint");
const QRCode = require('qrcode');


///This is an API that enables an owner of listing his products
const getAllProducts = async (req, res) => {

    const product = await productModel.find({}).populate([{

        path: 'createdBy',
        select: 'userName email'
    },
    {
        path: 'comments',
        populate: [
            {
                path: 'commentedBy',
                select: 'userName email'
            }
        ]
    },
    {
        path: 'likes',
        select: 'userName email'

    }
    ]);


    res.status(200).json({ message: "Done", product })
}

///this API generates QR codes for each product
function generateQRCode(productTitle, productDesc, productPrice){
    var segs = [
        { data: `${productTitle}` },
        { data: `${productDesc}` },
        { data: `${productPrice}` },
      ]
    QRCode.toDataURL(`${segs}`, function (err, url) {
        if (err) {
            
        res.status(400).json({messsage:"QR error",err})
        } else {
        console.log(url);
        return url;
        }
      })
}


///through this API an owner/user can create their own product/s
const addProduct = async (req, res) => {
    const { productTitle, productDesc, productPrice } = req.body;
    const product = await productModel({ productTitle, productDesc, productPrice, createdBy: req.user._id , QRCode: generateQRCode(productTitle, productDesc, productPrice)})
    const saveProduct = await product.save();
    //await userModel.findByIdAndUpdate( req.user._id,{$push:{wishlist:saveProduct._id}})
    res.status(201).json({ message: "Done", saveProduct })
}



///this API enables an owner of deleting a user by a soft delete
const softDelete = async (req , res) => {
    try {
        const {productId} = req.params;
        const product = await productModel.findOne({ _id: productId });
        const user = await userModel.findById(req.user._id);
        if (user.role == endPoint.deleteProduct || user._id == product.createdBy) {
            await productModel.findByIdAndUpdate(product._id, { isDeleted: true })
            res.status(200).json({ message: "Done", product })
        }
        else{
            res.status(401).json({ message: "You do not have the permission to delete that product " })
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error });
    }
}

///thought this API an owner can delete his products
const deleteProduct = async(req, res) =>{
    try {
        const {productId} = req.params;
        const product = await productModel.findOne({ _id: productId });
        const user = await userModel.findById(req.user._id);
        if (user.role == endPoint.deleteProduct || user._id == product.createdBy) {
            await productModel.findByIdAndDelete(product._id, { new: true })
            res.status(200).json({ message: "Done, this product has been deleted", product })
        }
        else{
            res.status(401).json({ message: "You do not have the permission to delete that product " })
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error });
    }
}


///if a user likes a product and wants to add it to their wishlist for later purchase, they can user this API
const addProductToWishlist = async (req, res) => {
    const { productId } = req.params;
    const product = await productModel.findOne({ _id: productId });
    const user = await productModel.findOne({ _id: req.user._id });
    if (!product) {

        res.status(404).json({ message: "in-valid product id" })

    } else {
        console.log(product.wishlists);
        if (!product.wishlists.includes(req.user._id) && !user.wishlist.includes(productId)) {

            await productModel.findByIdAndUpdate(productId, { $push: { wishlists: req.user._id } })

            const userProduct = await userModel.findByIdAndUpdate(req.user._id, { $push: { wishlist: productId } });
            res.status(200).json({ message: "Done", userProduct })
        } else {

            res.status(400).json({ message: "this product is already added before" })
        }
    }



}


///a user can like a product through this API
const likeProduct = async (req, res) => {

    await productModel.findByIdAndUpdate(req.params.productId, { $push: { likes: req.user._id } })
    res.status(200).json({ message: "Done" })

}



////A user can dislike a product through this API
const unLikeProduct = async (req, res) => {

    await productModel.findByIdAndUpdate(req.params.productId, { $pull: { likes: req.user._id } })
    res.status(200).json({ message: "Done" })



}


///if an owner wishes to hide some of their products from the rest of the users, due to shortage...etc , they can use this API
const hideProduct = async (req, res) => {

    await productModel.findByIdAndUpdate(req.params.productId, { hidden: true })
    res.status(200).json({ message: "Done, this product is already hidden now!" })



}

const updateProduct = async (req , res) =>{
    try {
        const {productId} = req.params;
        const { productTitle, productDesc, productPrice } = req.body;
        const user = await userModel.findById(req.user._id);
        const product = await productModel.findOne({productId});
        if(product.createdBy == user._id){
            const updatedProduct = await productModel.findByIdAndUpdate(product._id , {productTitle: productTitle}, {productDesc: productDesc}, {productPrice: productPrice});
            res.status(200).json({ message: "Done" , updatedProduct });
        }else{
            res.status(400).json({message:"sorry, you are not authorized to update this product"});
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error });
    }
}


module.exports = {
    addProduct,
    getAllProducts,
    softDelete,
    deleteProduct,
    addProductToWishlist,
    likeProduct,
    unLikeProduct,
    hideProduct,
    updateProduct
}