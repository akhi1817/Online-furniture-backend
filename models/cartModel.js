const mongoose =require('mongoose');


const cartSchema = new mongoose.Schema({
    productId:{
        type:String,
        required:true,
        ref:'Product'
    },
    quantity:{
        type:Number,
    },
    userId:{
        type:String,
        required:true
    },
})

const Cart = mongoose.model("Cart",cartSchema);


module.exports=Cart;