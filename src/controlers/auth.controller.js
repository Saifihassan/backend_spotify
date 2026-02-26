const userModel = require('../models/user.model')
const jwt= require('jsonwebtoken')
const bcrypt = require('bcryptjs')



async function register(req,res) {
    const {username,email,password,role="user"} = req.body

    if(!username||!email||!password||!role){
        return res.status(400).json({
            message:"all fields are required"
        })
    }

    const alreadyExists = await userModel.findOne({
      $or:[
        {username},
        {email}
      ]
    })

    if(alreadyExists){
        return res.status(409).json({
            message:"user already exists"
        })
    }

    const hash  = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash,
        role
    })

    const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET)

    res.cookie('token',token)
    res.status(200).json({
        message:'user create successfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role
        }
    })

}

async function login(req,res) {
    const {username,email,password} = req.body

     const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
     })
     
     if(!user){
         return res.status(401).json({
             message:"invalid credentials"
         })
     }
     
     const isValid = await bcrypt.compare(password,user.password)
     if(!isValid){
         return res.status(401).json({
             message:"Invalid credentials"
         })
     }
     
     const token = jwt.sign({
         id:user._id,
         role:user.role,
     },process.env.JWT_SECRET)
     res.cookie("token",token)
     
     res.status(200).json({
         message:"logged in successfully",
         user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role
         }
     })
}


module.exports={
    register,
    login
}