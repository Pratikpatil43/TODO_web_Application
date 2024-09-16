const express = require('express');
const router = express.Router();
const User = require('../models/Users')
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")

const { promisify } = require('util');

const verifyToken = promisify(jwt.verify);

const secretkey = "jfjhjfdfldjfkdhfksjgjsdkg4758yiuht5h89t5yte5jthe5ty54utrt4$%^^%&%^%&^hgfdhufb"

//Register

router.post('/register', async (req,res)=>{
    try {
        const {email, username, password} = req.body;
        if (!email, !username, !password) return res.status(400).json({ status:false, message:"All fields are required"});

        const existingUser = await User.findOne({email})

        if(existingUser) return res.status(400).json({ status:false, message:"Email already registered"})

            const hashPassword = await bcrypt.hash(password,10)

            const newUser = new User({username,email,password:hashPassword});
            await newUser.save();


            return res.status(201).json({ status:true, message:"Registered Successfull"})
        
        return
        
    } catch (error) {
        
    }
})


//login

router.post('/login', async (req,res)=>{
    try {
        const {username, password} = req.body;
        if (!username || !password) return res.status(400).json({ status:false, message:"All fields are required"});

        const user = await User.findOne({username})

        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(400).json({status:true, message:"Invalid credentials"})
        }

        const token = jwt.sign({id:user._id, username:user.username},secretkey, { expiresIn: '1hr'})



            return res.status(201).json({ status:true, message:"Login Successfull",token: token})
        
        return
        
    } catch (error) {
        return res.status(201).json({ status:true, message:"something went wrong",error: error.message})

        
    }
})



//profile


router.post('/profile', async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1]; // Correct the token split
        if (!token) {
            return res.status(400).json({ status: false, message: "Access Denied" });
        }

        // Verify token and decode
        const decoded = await verifyToken(token, secretkey);  // Promisified version of jwt.verify

        // Find user by decoded id
        const user = await User.findById(decoded?.id);
        userData = {
            id: user.id,
            username: user.username,
            email: user.email
        }
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Return profile data
        return res.status(200).json({ status: true, message: "Profile Data", data: userData });

    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
});

module.exports = router;

