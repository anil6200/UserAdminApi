const User=require('../Models/usermodel');
const{hashPassword,comparePassword}=require('../utils/bcrypt');
const {generateToken, GenerateToken}=require('../utils/jwt');
//user Signup
exports.signup=async(req , res)=>{
    try{
        const {firstname,lastname,email,phone,password,confirm_password,address,country,state,pin}=req.body;
        if(!firstname || !lastname || !email || !phone || !password || !confirm_password){
            return res.status(400).json({
                success:false,
                message:"please provide required fields"
            });
        }
        if(password !==confirm_password){
            return res.status(400).json({
                success:false,
                message:"Password do not match"
            })
        }
        const existingUser=await User.findOne({$or:[{email},{phone}]});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"Email or phone already exists"
            });
        }
        const hashedPassword=await hashPassword(password);
        const user=new User({firstname,lastname,phone,email,password:hashedPassword,country,address,state,pin,role:'user'});
        const userdata=await user.save();
        res.status(201).json({
            success:true,
            data:userdata,
            message:"User signup successfully"
        })

    }catch(e){
        res.status(500).json({
            success:false,
            message:e.message
        })
    }
}
//user login 
exports.login=async(req,res)=>{
    try{
        const {emailOrphone , password}=req.body
        if(!emailOrphone || !password){
            return res.status(400).json({
                success:false,
                message:"Email/phone and password required"
            });
        }
        const user=await User.findOne({$or:[{email:emailOrphone},{phone:emailOrphone}]});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            });
        }
        const ismatch= await comparePassword(password,user.password);
        if(!ismatch){return res.status(400).json({
            success:false,
            message:"invalid password"
        });}
        const token=GenerateToken({
            id:user._id,
            role:user.role
        });
        await user.save();
        res.cookie('AccessToken',token,{
            httpOnly:true,
            secure:true,
            sameSite:'Strict'
        });
        res.status(200).json({
            success:true,token,
            message:"User login successfully"
        });
    }catch(e){
        res.status(500).json({
            success:false,
            message:e.message
        })
    }
}

exports.authUser=(req,res)=>{
    try{
        if(req.user.role !=='user'){
            return res.status(400).json({
                success:false,
                message:"Wrong user role"
            });
        }
        return res.status(200).json({
            success:true,
            message:"Authenticate successfully"
        })
    }catch(e){
        res.status(500).json({
            success:false,
            message:e.message
        });
    }
}
exports.getUser=async(req,res)=>{
    try{
        const getdata=await User.find();
        return res.status(200).json({
            success:true,
            data:getdata,
            message:"All data fetched"
        })
    }catch(e){
        res.status(500).json({
            success:false,
            message:e.message
        });
    }
}
exports.updateuser=async(req,res)=>{
    try{
        const {id}=req.params;
        const {firstname,lastname,state,pin,country,address,phone,email,password}=req.body
        const user=await User.findById(id);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        if(firstname) user.firstname=firstname;
        if(lastname)  user.lastname=lastname;
        if(phone)    user.phone=phone;
        if(email)  user.email=email;
        if(state)  user.state=state;
        if(pin)    user.pin=pin;
        if(country) user.country=country;
        if(address) user.address=address;
        if(password) user.password=await hashPassword(password)

        await user.save();
        res.status(200).json({
            success:true,
            updateddata:user,
            message:"user updation successfully"
        });

    }catch(e){
        res.status(500).json({
            success:false,
            message:e.message
        });
    }
}
exports.deleteuser=async(req,res)=>{
    try{
        const {id}=req.params;
        const deleteuser=await User.findByIdAndDelete(id);
        if(!deleteuser){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }res.status(200).json({
            success:true,
            message:"delete operation successfull"
        });

    }catch(e){
        res.status(500).json({
            success:false,
            message:e.message
        });
    }
}