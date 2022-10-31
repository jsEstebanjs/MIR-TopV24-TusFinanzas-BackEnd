const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./user.model");

module.exports = {

   async signup(req,res){
      try{

         const { email, password } = req.body
         const encPassword = await bcrypt.hash(password,8)
         const user = await User.create({ email, password:encPassword})

         const token = jwt.sign(
            { id: user._id },
            "secretKey",
            { expiresIn: 60 * 60  }
         )
         res.status(200).json({ message:"user created",data:{ token, email }})

      }catch(err){
         res.status(400).json({ message:"user not created" , data: err})

      }
   },
   async signin(req,res){
      try{
         const { email , password } = req.body
         const user = await User.findOne({ email })

         if(!user){
            throw new Error("invalid email or password")
         }

         const isValid = await bcrypt.compare(password , user.password)

         if(!isValid){
            throw new Error("invalid email or password")
         }

         const token = jwt.sign(
            { id: user._id },
            "secretKey",
            { expiresIn: 60 * 60 * 24 }
         )

         res.status(201).json({ message:"User logged in", data:{ email,token }})

      }catch(err){
         res.status(400).json({ message:"error when logging" , data: err.message})

      }
   },



}