import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from "../models/user.model.js";



const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRATE)
}

const userLogin=async(req,res)=>{
    try {
        const {email,password}=req.body;

        const user=await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"User dosn't exist"})
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if (isMatch) {
            const token=createToken(user._id);
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid credentials "})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

const userRegister=async(req,res)=>{
    try {
        const {name,email,password}=req.body;

        // cheaking user is exist or not

        const exist=await userModel.findOne({email})
        if (exist) {
            return res.json({
                success:false,message:"User is already exist"
            })
        }

        // validating email format & strong password

        if (!validator.isEmail(email)) {
            return res.json({
                success:false,message:"Please enter valid email."
            })
        }

        if (password.length<8) {
            return res.json({
                success:false,message:"Please enter strong password"
            })
        }

        // Hashing user password

        const salt=await bcrypt.genSalt(10)
        const hashPassword= await bcrypt.hash(password,salt)

        // creating user

        const newUser=new userModel({
            name,
            email,
            password:hashPassword
        })

        const user=await newUser.save()

        const token=createToken(user._id)
        res.json({
            success:true,
            token
        })

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

const adminLogin=async(req,res)=>{
    try {
        const { email,password }=req.body

        if (email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD) {
            const token=jwt.sign(email+password,process.env.JWT_SECRATE)
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credintials"})
        }
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}

export {userLogin,userRegister,adminLogin}
