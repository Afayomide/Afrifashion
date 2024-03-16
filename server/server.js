const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Clothes = require("./models/clothesData")
const Customer = require('./models/customer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
require('dotenv').config();
const session = require("express-session")


const dburl = process.env.dburl

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  dburl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log('connected')
);

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.text());

  const targetURL = 'https://github.com/Afayomide/adotadvisor/tree/main/server';


  function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Store decoded user ID (userId) for access in route handler
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  }


app.get('/', (req, res) => {
  res.redirect(targetURL);

});
app.get("/api/search", (req,res) =>{
  res.redirect(targetURL);
})
app.get("/api", (req,res) =>{
  res.redirect(targetURL);
})



app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const customer = await Customer.findOne({ username });
    req.app.set("name", username) 

    if (customer && bcrypt.compareSync(password, customer.password)) {
        const token = jwt.sign({ userId: customer._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
        console.log(token)
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



app.post('/api/signup', async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!username || !password || !fullname || !email) {
    res.json({ success: false, message: 'All Fields are required' });
  }

  try {
    const existingUser = await Customer.findOne({ username });

    if (existingUser) {
      return res.json({ success: false, message: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const customer = new Customer({
      fullname,
      username,
      email,
      password: hashedPassword,
    });
    await customer.save();
    res.json({ success: true });
  } 
  catch (error) {
    console.error('Error:', error.message);
    res.json({ success: false, message: 'Internal server error' });
  }
});




app.get('/api/user', (req, res) => {
  let name = res.app.get("name")
  res.json({ success: true, message: 'User route is protected', name});
});

app.get("/api/cart",async(req,res) => {
     let name = res.app.get("name")
     var cartLength
     try {
      const customer = await Customer.findOne({username: name});
      console.log(customer)
        if(customer) {
           cartLength = customer.cart.length
        }

        else {
          return res.status(404).json({ message: 'User not found' });
        }
                  
        res.json(cartLength);

    
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });




  
  app.post('/api/search', async (req, res) => {
    let name = res.app.get("name")

    try {
      const result = await Instruments.find({ RiskScore: level });
  
      res.json(result);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

app.get('/api/protected', (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user});
});



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
