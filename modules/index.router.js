const userRouter = require('./user/user.router')
const productRouter = require('./product/product.router')
const commentRouter = require('./comment/comment.router')
const authRouter = require('./auth/auth.router')

module.exports = {
    userRouter ,
    productRouter,
    commentRouter,
    authRouter
}