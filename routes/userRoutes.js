const express=require("express");
const { registerUser, loginUser, logoutUser, uploadAvatar, updateUserDetails, getLoginUserDetails, getAllUsers, addToCart, countProduct, displayCartProducts, UpdateCartProduct, deleteCartProduct } = require("../controllers/userController.js");
const auth=require('../middleware/authMiddleware.js');
const router=express.Router();
const upload=require('../middleware/multerMiddleware.js');


router.get('/login-user-details',auth,getLoginUserDetails);
router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/logout',auth,logoutUser)
router.post('/upload-avatar',auth,upload.single('avatar'),uploadAvatar);


//admin panel
router.get('/all-users',auth,getAllUsers)
router.put('/update-user/:id',auth,updateUserDetails)

// add to cart
router.post('/addtocart',auth,addToCart)
router.get('/countproduct',auth,countProduct)
router.get('/viewcartproducts',auth,displayCartProducts)
router.put('/updatecartproduct',auth,UpdateCartProduct)
router.delete('/deletecartproduct/:id',auth,deleteCartProduct)


module.exports = router