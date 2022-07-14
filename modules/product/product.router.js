const { auth } = require("../../middleware/auth");
// const { myMulter, fileValidation } = require("../../services/multer");
const { endPoint } = require("./product.endPoint");
const productController= require("./controller/product")
const router = require("express").Router();
const validators= require("./product.validation");
const validation  = require("../../middleware/validation");

router.post("/addproduct",auth(endPoint.addProduct), validation(validators.addProductValidator),productController.addProduct),

router.patch("/:productId/wishlist",auth(endPoint.addProductToWishlist), validation(validators.addProductToWishlistValidator),productController.addProductToWishlist),

router.delete("/:productId/deleteProduct",auth(endPoint.deleteProduct),validation(validators.deleteProductValidator),productController.deleteProduct)

router.patch("/:productId/softDeleteProduct",auth(endPoint.deleteProduct),validation(validators.softDeleteProductValidator),productController.softDelete),

router.patch("/:productId/like",auth(endPoint.addProduct),validation(validators.likeProductValidator),productController.likeProduct),

router.patch("/:productId/unlike",auth(endPoint.addProduct),validation(validators.likeProductValidator),productController.unLikeProduct),

router.patch("/:productId/hide",auth(endPoint.addProduct),validation(validators.hideProductValidator),productController.hideProduct),

router.get("/allProducts",auth(endPoint.deleteProduct),productController.getAllProducts)

router.patch('/updateproduct/:productId' , auth(endPoint.addProduct) , validation(validators.updateProductValidator) ,productController.updateProduct)


module.exports= router;