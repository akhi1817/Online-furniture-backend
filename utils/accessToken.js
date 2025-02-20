const jwt=require('jsonwebtoken');


const accessToken=async(userId)=>{
    try{

        const token= await jwt.sign({id:userId},process.env.SECRET_KEY_ACCESS_TOKEN,{expiresIn:'3h'})
        return token
    }
    catch(err){
        console.log('Error in generating access token',err);

    }
}

module.exports=accessToken;