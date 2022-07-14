const Joi= require("joi")

const updateCommentValidator={
    params:Joi.object().required().keys({
        commentId: Joi.string().required(),
    }),
    body:Joi.object().required().keys({
        text: Joi.string().required(),
    })
}

const deleteCommentValidator ={
    params:Joi.object().required().keys({
        commentId: Joi.string().required(),
    })
}

const createCommentValidator={
    body: Joi.object().required().keys({
        text:Joi.string().required(),
    }),
    params: Joi.object().required().keys({
        postId:Joi.string().min(24).max(24).required(),
    })
}

const likeCommentValidation={
  
    params: Joi.object().required().keys({
        commentId:Joi.string().min(24).max(24).required(),
    })
}

const unlikeCommentValidation={
  
    params: Joi.object().required().keys({
        commentId:Joi.string().min(24).max(24).required(),
    })
}

const replyonCommentValidation={
    body: Joi.object().required().keys({
        text:Joi.string().required(),
    }),
    params: Joi.object().required().keys({
        productId:Joi.string().min(24).max(24).required(),
        commentId:Joi.string().min(24).max(24).required()
    })
}

module.exports = {
    updateCommentValidator,
    deleteCommentValidator,
    createCommentValidator,
    likeCommentValidation,
    unlikeCommentValidation,
    replyonCommentValidation
};

