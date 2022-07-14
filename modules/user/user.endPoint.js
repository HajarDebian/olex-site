const { roles } = require("../../middleware/auth");


const endPoint = {
    deleteUser:[roles.Admin],
    notAllowed: [roles.Admin],
    deleteAccount: [roles.User],
    displayProfile: [roles.Admin,roles.User],
    updateProfile: [roles.User,roles.Admin],
    notAllowed:[roles.Admin],
    UserList: [roles.Admin],
    productList: [roles.Admin],
    commentsList: [roles.Admin],
    deleteUser: [roles.Admin],
    getInvoice: [roles.Admin]


}


module.exports = {
    endPoint
}