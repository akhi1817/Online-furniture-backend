const User= require('../models/userModel.js');
const bcrypt=require('bcryptjs');
const uploadImageCloudinary = require('../utils/uploadImageCloudinary.js');
const fs=require('fs');
const mongoose = require('mongoose');
const accessToken = require('../utils/accessToken.js');
const { error } = require('console');
const Cart = require('../models/cartModel.js');

// register user
const registerUser=async(req,res)=>{
    try{

        const { name, email , password} =req.body;

        if(!name || !email || !password){
            return res.status(400).json({"message":"provide required credentials", error:true,success:false});
        }

        const existingUser=await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({"message":"User already Exists",error:true,success:false});
        }

        const hashedpassword= await bcrypt.hash(password,10);

        const newUser=new User({
            name,
            email,
            password:hashedpassword
        })

        const savedUser= await newUser.save();


        res.status(201).json({"message":"User Registered Successfully..","name":savedUser.name,"email":savedUser.email,"password":savedUser.password});
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message":"some error is occured",error:true,success:false,"error":err})
    }
}



// login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ "message": "Please provide credentials" });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ "message": "Please register yourself", error: true, success: false });
        }

        const checkPassword = await bcrypt.compare(password, existingUser.password);

        if (!checkPassword) {
            return res.status(400).json({ "message": "Wrong password! Check your password", error: true, success: false });
        }

        // Generate JWT Token
        const token = await accessToken(existingUser._id);

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: true,     
            sameSite: "None",  
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });


        res.status(200).json({ message: "Login Successfully", error: false, success: true});
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Some error occurred in login", error: true, success: false });
    }
};



// logout user
const logoutUser = async (req, res) => {
    try {
        console.log("Request Cookies Before Clearing:", req.cookies);

        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };
        res.clearCookie('accessToken', cookieOption);
        

        console.log("Cookies Cleared");
        res.status(200).json({data:[], "message": "Logout Successfully..", error: false, success: true });
    } catch (err) {
        console.error("Logout Error:", err);
        res.status(500).json({ "message": "Some error in logout", "error": err });
    }
};



// upload avatar image
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded. Please upload a file.' });
        }
        const imageUrl = await uploadImageCloudinary(req.file.path);

        const user = await User.findByIdAndUpdate(req.user.id,{ avatar: imageUrl },{ new: true });
        res.status(200).json({ "message": "Avatar uploaded successfully", data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "message": "Error uploading avatar", error: err.message });
    }
};



// get all users
const getAllUsers= async (req,res)=>{
    try{
        console.log("userid",req.user.id);
        const getAllUsers= await User.find();
        res.status(200).json({"message":"Data Fetched Successfully..","data":getAllUsers,error:false,success:true});
    }
    catch(err){
        console.log(err);
      res.status(500).json({message: "Something is wrong Please try again !!!",error: err,success: false})
}
}



//get login User Details
const getLoginUserDetails = async (req, res) => {
    try {
      const userId = req.user.id;
      const loginUser = await User.findById(userId);
      res.status(200).json({message: "User Details Successfully Fetched..",data: loginUser,error: false,success: true});
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Something is wrong Please try again !!!", error: err, success: false});
    }
  };



// update User Detailss
const updateUserDetails=async(req,res)=>{
    try {
        const { id } = req.params;  
        const { role } = req.body;  
    
        const updatedUser = await User.findByIdAndUpdate(id,{ role },{ new: true });
    
        if (!updatedUser) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
    
        res.status(200).json({
          success: true,
          message: "User role updated successfully",
          data: updatedUser,
        });
      } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
}



//add to cart
const addToCart=async(req,res)=>{
    try{
        const {productID} = req?.body

        const currentUser= req.user.id


        const isProductAvailable = await Cart.findOne({userId:currentUser, productId:  productID });
        if(isProductAvailable){
            return res.status(409).json({"message":"Product is already Exist",error:true,success:false})
        }


        const paylaod={
            productId:productID,
            quantity:1,
            userId:currentUser,
            
        }


        const newProduct= new Cart(paylaod)
        const savedProduct=await newProduct.save();

        res.status(201).json({message:"product added to the cart",data:savedProduct,error:false,success:true})

    }
    catch(err){
        res.status(400).json({message:"Unable to add to the cart",data:error,error:true,success:false})
    }
}



// count of products add to cart
const countProduct=async(req,res)=>{
    try{

        const userId=req.user.id;

        const count = await Cart.countDocuments({
            userId :userId
        })

        res.status(200).json({message:"count added successfully..",data:count,error:false,success:true})

    }
    catch(err){
        res.status(400).json({message:"Unable to add the count",data:error,error:true,success:false})
    }
}



//display the cart product
const displayCartProducts=async(req,res)=>{
    try{
        const currentUser=req.user.id;

        const allProducts= await Cart.find({userId:currentUser}).populate("productId")
        
        res.status(200).json({message:"data displayed successfully..",data:allProducts,error:false,success:true})

    }
    catch(err){
        res.status(400).json({message:"failed to display product",data:err,error:true,success:false})
    }
}



//update add to cart product

const UpdateCartProduct = async (req, res) => {
    try {
      const currentUserId = req.user.id;
      // Destructure _id and quantity from the request body
      const { _id, quantity } = req.body;
  
      // Check if both fields are provided.
      if (!_id || quantity === undefined) {
        return res.status(400).json({ message: "Missing required fields", success: false });
      }
  
      // Update the product ensuring the product belongs to the current user.
      const updateProduct = await Cart.updateOne(
        { _id, userId: currentUserId },
        { $set: { quantity } }
      );
  
      // You might want to check if any document was actually modified:
      if (updateProduct.matchedCount === 0) {
        return res.status(404).json({ message: "Product not found or not authorized", success: false });
      }
  
      res.status(200).json({ message: "Product Updated", data: updateProduct, error: false, success: true });
    } catch (err) {
      console.error("Update error:", err);
      res.status(400).json({ message: "Unable to update product", data: err, error: true, success: false });
    }
  };
  


//delete cart Product
const deleteCartProduct = async (req, res) => {
    try {
      const currentUserId = req.user.id;
      // You can either pass the product ID in params or in the body.
      // Here, we'll assume it comes in the URL parameters:
      const { id } = req.params; 
  
      if (!id) {
        return res.status(400).json({ message: "Missing cart product ID", success: false });
      }
  
      // Delete the cart product ensuring it belongs to the current user.
      const deleteResult = await Cart.deleteOne({ _id: id, userId: currentUserId });
  
      // Check if a document was actually deleted.
      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ message: "Cart product not found or not authorized", success: false });
      }
  
      return res.status(200).json({ message: "Cart product deleted", success: true });
    } catch (err) {
      console.error("Delete error:", err);
      return res.status(400).json({ message: "Unable to delete product", error: err, success: false });
    }
  };
  




module.exports={
    registerUser,loginUser,logoutUser,uploadAvatar,updateUserDetails,getLoginUserDetails,
    getAllUsers,addToCart,countProduct,displayCartProducts,UpdateCartProduct,deleteCartProduct
}