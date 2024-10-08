const express = require("express");
const router = express.Router()
const {verifyToken} = require('./verifyToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const Customer = require('../../models/customer');



router.get('/checkAuth', verifyToken, async (req, res) => {
    try {
       const user = await Customer.findById(req.user.userId).select('-password'); // Exclude password field
       if (!user) {
         return res.status(404).json({ message: 'User not found' });
       }
       res.json({ user });
     } catch (error) {
       res.status(500).json({ message: 'Internal server error' });
       res.json({error})
       
     }
   });
   
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
      
    try {
      const user = await Customer.findOne({ email });
      console.log(user)
  
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.json({ success: false, message: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '4d' });
      res.cookie('token', token, {
        httpOnly: true,   
        secure: process.env.NODE_ENV === 'production',  
        // remove in test
        sameSite: process.env.SAME_SITE,  
        maxAge: 4 * 24 * 60 * 60 * 1000 
      });
      console.log(res.cookie)
      res.json({success: true, user});
  
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  
  
  router.post('/signup', async (req, res) => {
    const { fullname, username, email, password } = req.body;
    
      if (!username || !password || !fullname || !email) {
        return res.json({ success: false, message: 'All fields are required' }); // Use return to prevent further execution
      }
    
      try {
        const existingUser = await Customer.findOne({ username });
    
        if (existingUser) {
          return res.json({ success: false, message: 'Username already exists' }); // Use return to prevent further execution
        }
    
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        
        const newUser = new User({
          fullname,
          username,
          email,
          password: hashedPassword,
        });
    
        await newUser.save();
        return res.json({ success: true });
      } catch (error) {
        console.error('Error:', error.message);
        return res.json({ success: false, message: 'Internal server error' });
      }
  });
  
  router.post('/logout', async (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
      sameSite: process.env.SAME_SITE,
      maxAge: 0 
    });
  
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  });

  module.exports = router