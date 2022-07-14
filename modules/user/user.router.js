const router = require('express').Router();
const validators= require("./user.validation")
const { auth } = require("../../middleware/auth");
const userController = require("./controller/user")
const { endPoint } = require("./user.endPoint");
const validation = require("../../middleware/validation");
const { myMulter, fileValidation, HandleMulterError } = require("../../services/multer");


router.get("/profile",validation(validators.displayProfileValidator),auth(endPoint.displayProfile),userController.displayProfile)

router.patch("/profile/pic",myMulter("user/profile/pic",fileValidation.image).array('image',5),HandleMulterError,auth(endPoint.displayProfile),userController.profilePicture)

router.patch("/profile/covPic",myMulter("user/profile/covPic",fileValidation.image).array('image',5),HandleMulterError,auth(endPoint.displayProfile),userController.profileCoverPicture)

router.patch("/profile/updatePassword",validation(validators.updatePasswordValidator),auth(endPoint.displayProfile),userController.updatePassword)

router.patch("/profile/updateProfile",validation(validators.updateProfileValidator),auth(endPoint.updateProfile),userController.updateProfile)

router.delete("/:userId/deleteByAdmin",validation(validators.deleteUserByAdminValidator),auth(endPoint.deleteUser),userController.deleteUserByAdmin)

router.delete("softdelete/:userId" , validation(validators.softDeleteUserValidator) , auth(endPoint.deleteAccount) , userController.softDeleteUser)

router.delete("/deleteAccount",validation(validators.deleteAccountByUser) ,auth(endPoint.deleteAccount),userController.deleteAccountByUser)

router.get("/allusers" , auth(endPoint.UserList) , userController.getAllUsers)

router.get('/allproducts' , auth(endPoint.productList) , userController.getAllProducts)

router.get('/allcomments' , auth(endPoint.commentsList) , userController.getAllComments)

router.get('/invoice' , auth(endPoint.getInvoice) , userController.invoice)

module.exports= router;