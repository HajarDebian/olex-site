const router = require('express').Router();
const validation = require("../../middleware/validation")
const validators=require("./comment.validation")
const commentController =require("./controller/comment")
const endPoint = require('./comment.endPoint')
const {auth} = require("../../middleware/auth")

router.patch("/:producttId/comment",auth(endPoint.createComment),validation(validators.createCommentValidation),commentController.createComment),

router.delete("/deletecomment/:commentId" , auth(endPoint.deleteComment) , validation(validators.deleteCommentValidator) , commentController.deleteComment)

router.patch('/updatecomment/:commentId' , auth(endPoint.updateComment) , validation(validators.updateCommentValidator) ,commentController.updateComment)

router.patch('likeComment/:commentId' , auth(endPoint.likeComment) , validation(validators.likeCommentValidation) , commentController.likeComment)

router.patch('unlikecomment/:commentId' , auth(endPoint.unLikeComment) , validation(validators.unlikeCommentValidation) , commentController.unLikeComment)

router.post('reply/:productId/:commentId' , auth(endPoint.reply) , validation(validators.replyonCommentValidation) , commentController.replyonComment)
module.exports= router;