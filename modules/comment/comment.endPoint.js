const { roles } = require("../../middleware/auth");


const endPoint = {
    createComment:[roles.User , roles.Admin],
    deleteComment: [roles.User , roles.Admin],
    updateComment: [roles.User , roles.Admin],
    likeComment: [roles.User , roles.Admin],
    unLikeComment: [roles.User , roles.Admin],
    reply: [roles.User , roles.Admin]
}


module.exports = {
    endPoint
}