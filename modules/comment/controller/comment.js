const commentModel = require("../../../DB/model/comment")
const userModel = require('../../../DB/model/user')
const productModel = require("../../../DB/model/product")

///an API to help a confirmed user to write a comment expressing their opinion on some product within the system
const createComment = async (req, res) => {
    const { text } = req.body;
    const { productId } = req.params;
    const { _id } = req.user;

    const product = await productModel.findOne({ _id: productId });
    if (!product) {
        res.status(404).json({ message: "in-valid product id" })
    } else {
        const comment = await commentModel({ text, createdBy: _id, productId: product._id })
        const saveComment = await comment.save();
        await productModel.findByIdAndUpdate(product._id,{$push:{comments:saveComment._id}})
        res.status(200).json({ message: "Done", saveComment })
    }


}



///An API for a user who prefers to delete their pre made comments
const deleteComment = async(req , res) => {
   try {
    const {commentId} = req.params;
    const user = await userModel.findById(req.user._id);
    const comment = await commentModel.findOne({commentId});
    const product = await productModel.findOne({comments: commentId}); //// question
    if(comment.commentedBy == user._id || product.createdBy == user._id){
        const deletedComment = await commentModel.findByIdAndDelete(commentId , {new: true});
        res.status(200).json({ message: "Done", deletedComment })
    }
    else{
        res.status(401).json({ message: "You do not have the permission to delete that product " })
    }
   } catch (error) {
    res.status(500).json({ message: "Catch error",error })
   }
}


///if the user just want to make new adjustments on the comment instead of deleting it, the can use this API
const updateComment = async (req , res) =>{
    try {
        const {commentId} = req.params;
        const {commentBody} = req.body;
        const user = await userModel.findById(req.user._id);
        const comment = await commentModel.findOne({commentId});
        if(comment.commentedBy == user._id){
            const updatedComment = await commentModel.findByIdAndUpdate(comment._id , {text: commentBody});
            res.status(200).json({ message: "Done" , updatedComment });
        }else{
            res.status(400).json({message:"sorry, you are not authorized to update this comment"});
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error });
    }
}

///An API that helps the user expressing that they like some specific comment on soome product within the system
const likeComment = async (req, res) => {

    await commentModel.findByIdAndUpdate(req.params.commentId, { $push: { commentLikes: req.user._id } })
    res.status(200).json({ message: "Done" })

}


///this API helps user who need to express that they are upset on some comment
const unLikeComment = async (req, res) => {

    await commentModel.findByIdAndUpdate(req.params.commentId, { $pull: { commentLikes: req.user._id } })
    res.status(200).json({ message: "Done" })

}



///some times a comment needs to be replied to, or users wwant to share their thought, this api helps them communicate through the comments
const replyonComment = async (req, res) => {
    const { text } = req.body;
    const { productId,commentId } = req.params;
    const { _id } = req.user;

    const product = await productModel.findOne({ _id: productId });
    if (!post) {
        res.status(404).json({ message: "in-valid post id" })
    } else {
        if (!post.comments.includes(commentId)) {
            
        res.status(404).json({ message: "in-valid comment id" })
        } else {
            
        const comment = await commentModel({ text, createdBy: _id, postId: post._id })
        const saveComment = await comment.save();
        await commentModel.findByIdAndUpdate(commentId,{$push:{reply:saveComment._id}})
        res.status(200).json({ message: "Done", saveComment })
        }
    }

}

module.exports = {
    createComment,
    likeComment,
    unLikeComment,
    updateComment,
    deleteComment,
    replyonComment
}