const { roles } = require("../../middleware/auth");


const endPoint = {
    addProduct:[roles.Admin , roles.User],
    addProductToWishlist: [roles.User],
    deleteProduct:[roles.Admin]
}


module.exports = {
    endPoint
}