const express=require("express");
const { getAllProducts, uploadProduct, updateProduct, getProductByCategory, getMultipleProductsByCategory, getProduct, searchProduts, filterProducts } = require("../controllers/productController");
const auth = require("../middleware/authMiddleware.js");
const router=express.Router();


router.post('/get-product',getProduct)
router.get('/get-all-products',getAllProducts)
router.post('/upload-product',auth,uploadProduct)
router.put('/update-product/:id',auth,updateProduct)
router.get('/get-categoryProduct',getProductByCategory)
router.get('/category-product',getMultipleProductsByCategory)
router.get('/search',searchProduts)
router.post('/filter-product',filterProducts)

module.exports=router;