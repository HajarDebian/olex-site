const Joi= require("joi")

const addProductValidator={
    body: Joi.object().required().keys({
        productTitle:Joi.string().required(),
        productDesc:Joi.string().required(),
        productPrice:Joi.number().required(),
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
const likeProductValidator={
  
    params: Joi.object().required().keys({
        productId:Joi.string().min(24).max(24).required(),
    })
}
const addProductToWishlistValidator={
  
    params: Joi.object().required().keys({
        productId:Joi.string().min(24).max(24).required(),
    })
}

const deleteProductValidator={
  
    params: Joi.object().required().keys({
        productId:Joi.string().min(24).max(24).required(),
    })
}
const softDeleteProductValidator={
  
    params: Joi.object().required().keys({
        productId:Joi.string().min(24).max(24).required(),
    })
}

const hideProductValidator={
  
    params: Joi.object().required().keys({
        productId:Joi.string().min(24).max(24).required(),
    })
}

const updateProductValidator={
    params:Joi.object().required().keys({
        productId: Joi.string().required(),
    }),
    body: Joi.object().required().keys({
        productTitle:Joi.string().required(),
        productDesc:Joi.string().required(),
        productPrice:Joi.number().required(),
    })
}

module.exports={
    addProductValidator,
    createCommentValidator,
    likeProductValidator,
    deleteProductValidator,
    softDeleteProductValidator,
    hideProductValidator,
    addProductToWishlistValidator,
    updateProductValidator
}