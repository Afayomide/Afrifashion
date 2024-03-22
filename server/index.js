const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Clothes = require("./models/clothesSchema")
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

  const targetURL = 'https://github.com/Afayomide';

  function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log("this is ", authHeader)
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Store decoded user ID for access in route handler
      const now = Date.now() / 1000; // Convert milliseconds to seconds
      if (decoded.exp < now) {
        console.warn('JWT has expired!');
        return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
      }
      else{
        console.log("still in session")
      }
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  }

  function checkJwtExpiry(req, res, next) {
    try {
      // Extract the JWT token from the authorization header (adapt based on your header name)
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Access token is missing or invalid' });
      }
  
      const token = authHeader.split(' ')[1];
  
      // Decode the JWT token and get payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if the expiration time (in seconds) has passed
      const now = Date.now() / 1000; // Convert milliseconds to seconds
      if (decoded.exp < now) {
        console.warn('JWT has expired!');
        return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
      }
  
      // Attach decoded user data to the request object (optional)
      req.user = decoded; // Adapt based on your desired property name for user data
  
      next(); 
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Unauthorized: Access token is invalid' });
    }
  }

  
  


app.get('/', (req, res) => {
  res.send("welcome");

});

app.get("/api", (req,res) =>{
  res.redirect(targetURL);
})



app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const customer = await Customer.findOne({ username });

    if (!customer || !bcrypt.compareSync(password, customer.password)) {
      return res.json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: customer._id }, process.env.JWT_SECRET, { expiresIn: '4d' });
    console.log(token);
    res.json({ success: true, token });
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


app.get("/api/cart", verifyToken, async(req,res) => {
  const id = req.user.userId; 
 console.log(id)
  try {
    const customer = await Customer.findById(id);
    if (customer) {
      const cartLength = customer.cart.length;
      res.json({ cartLength });
    } else {
      return res.status(404).json({ message: 'User not found' });
        }
                  
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    app.get("/api/fabrics",async(req,res) => {
  
      try {
       const fabrics = await Clothes.find();
       console.log(fabrics)
         if(fabrics) {      
             res.json({fabrics});
         }
 
         else {
           return res.status(404).json({ message: 'no fabric found' });
         }
                   
 
     
       } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Internal server error' });
       }
     });


    app.post('/api/cart/add', verifyToken, async (req, res) => {
      const userId = req.user.userId;
      try {
        const { productId } = req.body;
        if (!productId) {
          return res.status(400).json({ message: 'Missing product ID' });
        }
    
        const product = await Clothes.findById(productId);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        const customer = await Customer.findById(userId);
        if (customer) {
          const existingProduct = customer.cart.find(item => item._id.toString() === productId);
          if (existingProduct) {        
                console.log("already in cart")
            return res.status(400).json({ message: 'Product already in cart' });
          }
          else{
             customer.cart.push(product);
          await customer.save();
          }
         
        }
        res.json({ message: 'Product added to cart successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });


    app.get('/api/cart/list', verifyToken, async (req, res) => {
      const id = req.user.userId; 
    
      try {
        const customer = await Customer.findById(id);
        console.log(customer);
    
        if (customer) {
          const cartItems = customer.cart.map(async (itemId) => {
            const item = await Clothes.findById(itemId); 
            return item;
          });
    
          const resolvedCartItems = await Promise.all(cartItems);
          res.json({ cartItems: resolvedCartItems });
        } else {
          return res.status(404).json({ message: 'User not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    app.post('/api/aboutItem', async (req,res) =>{
           const {id} = req.body;

           try {
            const item = await Clothes.findById(id)
            if (item){           
              console.log(id)
              return res.json({success: true, item})
            }
           }
           catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
            }
    })

    // app.post('/api/cart/delete',verifyToken,  async (req, res) => {
    //   const userId = req.user.userId;
    //   const {productId} = req.body;
    
    //   try {
    //     const customer = await Customer.findById(userId);
    
    //     if (!customer) {
    //       return res.status(404).json({ message: 'Customer not found' });
    //     }
    
    //     const updatedCart = customer.cart.filter(item => item._id.toString() !== productId.toString()); 
    //     customer.cart = updatedCart;
    
    //     await customer.save();
    
    //     res.json({ message: 'Item deleted from cart successfully' });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Internal server error' });
    //   }

    // })

    app.delete('/api/cart/delete', verifyToken, async (req, res) => {
      const userId = req.user.userId;
      const { productId } = req.body;
    
      try {
        const customer = await Customer.findById(userId);
    
        if (!customer) {
          return res.status(404).json({ message: 'Customer not found' });
        }
    
        const updatedCart = customer.cart.filter(item => item._id.toString() !== productId.toString());
        customer.cart = updatedCart;
    
        await customer.save();
    
        res.json({ message: 'Item deleted from cart successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
    




const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
