const router = require("express").Router();
const validation = require("../../middleware/validation")
const validators=require("./auth.validation")
const registerationController =require("./controller/registration")

router.post("/signup",validation(validators.signupValodator),registerationController.signup)
router.get("/confirmEmail/:token",validation(validators.confirmEmailValidator),registerationController.confirmEmail)
router.get("/refreshEmail/:id",registerationController.refreshEmail)
router.post("/login",validation(validators.signinValidator),registerationController.login)
router.post("/sendCode",validation(validators.sendCodeValidator),registerationController.sendCode)
router.post("/forgetPassword",validation(validators.forgetPasswordValidator),registerationController.forgetPassword)

module.exports = router