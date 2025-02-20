const uploadProductPermission = require('../helpers/permission.js');
const Product=require('../models/productModel.js');
const mongoose=require('mongoose');



// get all Products
const getAllProducts=async(req,res)=>{
    try{
        const getProducts= await Product.find().sort({createdAt:-1});
        res.status(200).json({"message":"Products getting successfully","data":getProducts,error:false,success:true})

    }
    catch(err){
        res.status(400).json({"message":"Failed to getting Product","error":err,error:true,success:false})
    }
}

//get one product by id
const getProduct=async(req,res)=>{
    try{
                const {productId}= req.body
                const getProduct= await Product.findById(productId)
                res.status(200).json({"message":"Products getting successfully","data":getProduct,error:false,success:true})

    }
    catch(err){
        res.status(400).json({"message":"Failed to getting Product","error":err,error:true,success:false})
    }
}


// Upload New Product
const uploadProduct = async (req, res) => {
    try {
        const sessionId = req.user.id;
        if (!(await uploadProductPermission(sessionId))) {
            return res.status(400).json({ "message": "Permission denied" });
        }

        
        const { productName, category, productImage, price, sellingPrice } = req.body;

        if (!productName || !category || !productImage || !price || !sellingPrice) {
            return res.status(400).json({message: 'please fill Required Credentials',success: false,});
        }
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        return res.status(201).json({ message: "Product added successfully", data: savedProduct, error: false,success: true,});

    } catch (err) {
        console.error("Error uploading product:", err);
       
        return res.status(400).json({message: "Failed to upload product",error: true,success: false,});
    }
};



//update/edit the product 
const updateProduct = async (req, res) => {
    try {
        const sessionId = req.user.id; 

        if (!(await uploadProductPermission(sessionId))) {
            return res.status(400).json({ message: "Permission denied", success: false });
        }

        const { id } = req.params;
        const { productName, category, productImage, price, sellingPrice } = req.body;

        if (!productName || !category || !productImage || !price || !sellingPrice) {
            return res.status(400).json({ message: "Please fill in required credentials", success: false });
        }

    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID", success: false });
        }
    
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found",error:true,success: false });
        }

        return res.status(200).json({message: "Product updated successfully",data: updatedProduct,error:false,success: true});

    } 
    catch (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({message: "Failed to update product",error: err.message,success: false});
    }
};



//get product by category
const getProductByCategory=async(req,res)=>{
    try{
        const productCategory=await Product.distinct("category")

        console.log("data",productCategory);


         //array to store one product from each category
         const productByCategory=[]

         for(const category of productCategory){
             const product =await Product.findOne({category})
 
             if(product){
                 productByCategory.push(product);
             }
         }
 

        res.status(200).json({ message: "Products found", data: productByCategory,error:false,success:true});
    }
    catch(err){
        res.status(400).json({message:"Failed to getting Product by category",error:err,error:true,success:false})
    }
}



//get multiple products by category
const getMultipleProductsByCategory=async(req,res)=>{
    try{

        const { category } = req.query;

        if (!category) {
          return res.status(400).json({ message: 'Category query parameter is required.' });
        }
         // Find all products that match the given category
           const products = await Product.find({ category: category });
    res.status(200).json({ data: products });
    }
    catch(err){
        res.status(400).json({message:"Failed to getting Product by category",error:err,error:true,success:false})
    }
    

}



//search Product
const searchProduts=async(req,res)=>{
    try{

        const query=req.query.q

        const regex = new RegExp(query,'i','g')

        const product=await Product.find({
            "$or":[
                {
                    productName:regex
                },
                {
                    category:regex
                }
            ]
        })

        res.status(200).json({data:product,error:false,success:true})
        
    }
    catch(err){
        res.status(400).json({message:"Product not found",data:err,error:true,success:false})
    }
}



//filter Products
const filterProducts=async(req,res)=>{ 
    try{
            const categoryList = req?.body?.category

            const product= await Product.find({
                category :{
                    "$in":categoryList
                }
            })
            res.status(200).json({message:"product found successfully..",data:product,error:false,success:true})
    }
    catch(err){
        res.status(400).json({message:"unable to filter product",data:err,error:true,success:false})
    }
}


module.exports={
   getAllProducts,getProduct, uploadProduct ,updateProduct,getProductByCategory,getMultipleProductsByCategory,searchProduts,filterProducts
}