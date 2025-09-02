const jwt=require('jsonwebtoken');
const verifyToken=async(req,res,next)=>{
    const token=req.cookies.AccessToken;  //read accesstoken form client cookie
    //if token not exist
    if(!token){
        return res.status(401).json({
            message:'no token provided'
        });
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({message:'unauthorized'})
        }
        if(decoded.role!=='admin'){             //if token valid and role is not admin then through this forbidden response                       
            return res.status(403).json({message:'Access Denied.Admins Only'})
        }
        req.user=decoded;      //if token valid and role is  admin
        next();
    });
}
module.exports= verifyToken;