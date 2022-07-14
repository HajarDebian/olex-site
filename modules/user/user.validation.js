const Joi= require("joi")

const displayProfileValidator={
    headers: Joi.object().required().keys({
        authorization:Joi.string().required()
    }).options({allowUnknown:true})
}

const updatePasswordValidator={
    body:Joi.object().required().keys({
      
       
        oldPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        newPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        cPassword: Joi.string().valid(Joi.ref("newPassword")).required() // ref to refer password and check match or not
    })
}

const updateProfileValidator={
    body:Joi.object().required().keys({
      
        userName: Joi.string().pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/)).required().messages({
            'string.pattern.base': "plz follw my name rules",
            'any.required': "plz send u name",
            'string.empty': "plz fill in u name"
        }),
        
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    })
}

const deleteUserByAdminValidator={
  
    params: Joi.object().required().keys({
        userId:Joi.string().min(24).max(24).required(),
    })
}
const softDeleteUserValidator={
  
    params: Joi.object().required().keys({
        userId:Joi.string().min(24).max(24).required(),
    })
}

module.exports={
    displayProfileValidator,
    updatePasswordValidator,
    updateProfileValidator,
    deleteUserByAdminValidator,
    softDeleteUserValidator
}