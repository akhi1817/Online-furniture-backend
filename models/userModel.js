const mongoose=require('mongoose');


const userSchema= new mongoose.Schema({
        name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        avatar:{
            type:String,
            default:"",
        },
        mobile:{
            type:Number,
            default:""
        },
        role:{
            type:String,
            enum:["ADMIN","USER"],
            default:"USER",
        }
},{
    timestamps:true
})

const User=mongoose.model("User",userSchema);

module.exports=User;