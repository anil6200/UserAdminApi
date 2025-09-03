const jwt=require('jsonwebtoken');
const verifyAdmin=(req,res,next)=>{
    const token=req.cookies.AccessToken;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"no token provided"
        });
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                success:false,
                message:"unauthorized"
            });
        }
        if(decoded.role!=='admin'){
            return res.status(403).json({
                success:false,
                message:"Access denied.Admins Only"
            });
        }
        req.user=decoded;
        next();
    });
};

const verifyUser=(req,res,next)=>{
    const token=req.cookies.AccessToken;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"no token provided"
        });
    
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                success:false,
                message:"unauthorized"
            })
        }
        if(decoded.role!=='user'){
            return res.status(403).json({
                success:false,
                message:"Access Denied . Users Only."
            });
        }
        req.user=decoded;
        next();
    })
}
module.exports={verifyAdmin,verifyUser};