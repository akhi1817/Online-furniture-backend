const mongoose=require('mongoose');
const dotenv=require('dotenv');

dotenv.config();

if(!process.env.MONGODB_URI){
    return console.log("Please Provide a MONGODB_URI in the .env file")
}


const connnectDB=async()=>{
    try{
           await mongoose.connect(process.env.MONGODB_URI);
           console.log("database connected Successfully..")

    }
    catch(err){
        console.log("Error in connecting with database",err);

    }
}

module.exports=connnectDB;