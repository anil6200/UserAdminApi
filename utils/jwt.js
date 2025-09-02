const jwt=require('jsonwebtoken');
require('dotenv').config();
const GenerateToken=(payload)=>{
    return jwt.sign(payload,process.env.JWT_Secret,{expiresIn:'1hr'})
};
module.exports={GenerateToken};