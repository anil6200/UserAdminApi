const Admin = require('../Models/Adminmodel');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const {  GenerateToken } = require('../utils/jwt');
//Admin signup
exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email , Password are required"
            })
        }
        const existingemail = await Admin.findOne({ email });
        if (existingemail) {
            return res.status(409).json({
                message: "Email Already Exists"
            });
        }
        const hashedPassword = await hashPassword(password);
        const admin = new Admin({ email, password: hashedPassword, role: "admin" });
        const admindata = await admin.save();
        res.status(201).json({
            success: true,
            data: admindata,
            message: "Admin Signup Successfully "
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
//Admin login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password is required"
            });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }
        const ismatch = await comparePassword(password, admin.password);
        if (!ismatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"

            });
        }
        const token = GenerateToken({
            id: admin._id,
            role: admin.role

        });
        await admin.save();  //save or update the admin object in the database
        res.cookie('AccessToken', token, {
            httpOnly: true,      //browser k js se access nhi hoskta (xss attack se safe)
            secure: true,        //only send in https
            sameSite: 'Strict'   //cross site request forgery se protection
        });

        res.status(200).json({
            success: true,
            token,
            message: "Admin Loggedin Successfully"

        });


    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

exports.getAdmin = async (req, res) => {
    try {
        const getdata = await Admin.find();
        res.status(200).json({
            success: true,
            data:getdata,
            message: "All detils fetched successfully"
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

exports.authAdmin = (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(400).json({
                success: false,
                message: "wrong user role"
            });
        }
        return res.status(200).json({
            success: true,
            
            message: "Authentication successfully"
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

exports.UpdateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password } = req.body;
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            })
        }
        if (email) admin.email = email;  // if user pass an email  then update the admin email
        if (password) admin.password = await hashPassword(password) // if user has pass the password then update the password in hashpasword
        await admin.save();
        res.status(200).json({
            success: true,
            updateddata: admin,
            message: "Updation successfull"
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const removeAdmin = await Admin.findByIdAndDelete(id);
        if (!removeAdmin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Admin remove successfully"
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}