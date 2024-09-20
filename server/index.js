const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Clothes = require("./models/clothesSchema")
const Customer = require('./models/customer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
require('dotenv').config();
const app = express();
const redis = require('redis');
const verifyToken = require('./verifyToken');
const cookieParser = require('cookie-parser');
const paymentRouter = require('./routes/payments');
const nodemailer = require("nodemailer")


const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URL,
        port: 10755
    }
});

const corsOptions = {
  origin: ['http://localhost:5000', 'https://coolafristyles.web.app'],  
  credentials: true,
  // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use('/api', paymentRouter)

const dburl = process.env.dburl



app.use(express.json());



(async () => {
  try {
    await client.connect();
    console.log('Connected to Redis server successfully!');
  } catch (error) {
    console.log('Error connecting to Redis:', error);
  }
})();


async function connectToMongo(dburl) {
  const retryAttempts = 3; 
  const connectTimeoutMS = 20000; 

  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      await mongoose.connect(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS
      });
      console.log('Connected to Database');
      return; 
    } catch (error) {
      console.error(`Connection attempt ${attempt} failed:`, error.message);

      await new Promise(resolve => setTimeout(resolve, Math.min(attempt * 2000, 10000))); 
    }
  }

  throw new Error('Failed to connect to MongoDB Atlas after retries');
}

connectToMongo(dburl)
  .then(() => {
    console.log("connection succesful")
  })
  .catch(error => {
    console.error('Fatal error:', error.message);
  });



  const targetURL = 'https://github.com/Afayomide';




  
  


app.get('/', (req, res) => {
  res.send("welcome");

});

app.get("/api", (req,res) =>{
  res.redirect(targetURL);
})


app.get('/api/checkAuth', verifyToken, async (req, res) => {
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




app.post('/api/login', async (req, res) => {
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



app.post('/api/signup', async (req, res) => {
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

app.post('/api/logout', async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
    sameSite: process.env.SAME_SITE,
    maxAge: 0 
  });

  return res.status(200).json({ success: true, message: 'Logged out successfully' });
});

app.post("/api/contactUs",async (req,res) => {
  const {email, fullName, message, subject} = req.body
  try{
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS, 
      },
      tls: {
          rejectUnauthorized: false 
      }
  });

  const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: process.env.EMAIL_USER, 
      subject: subject,
      text: `full Name: ${fullName} \n Email: ${email} \n ${message} `,
  };
  await transporter.sendMail(mailOptions);
  res.json({success: true})
  }
  catch (error){
    console.error(error)
    res.json(error)
  }
})

app.get("/api/cart", verifyToken, async(req,res) => {
  const id = req.user.userId; 
  try {
    const customer = await Customer.findById(id);
    if (customer) {
      const cartLength = customer.cart.length;
      const fullName = customer.fullname
      const email = customer.email
      res.json({ cartLength, fullName, email });
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
        const cachedFabrics = await client.get('fabrics');

        if (cachedFabrics) {
          console.log("using cached")
          return res.json({fabrics : JSON.parse(cachedFabrics)});
        } 
        else{

       const fabrics = await Clothes.find();
         if(fabrics) {      
          await client.set('fabrics', JSON.stringify(fabrics));
          await client.expire('fabrics', 60 * 30); 
             res.json({fabrics});
         }
 
         else {
           return res.status(404).json({ message: 'no fabric found' });
         }
        }
                   
 
     
       } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Internal server error' });
       }
     });

    
app.get("/api/clothespreview", async (req, res) => {
  try {
    const cachedPreview = await client.get('preview');

    if (cachedPreview) {
      return res.json({previewData: JSON.parse(cachedPreview)});
    }

    const promises = [
      Clothes.find({ type: 'ankara' }).limit(5),
      Clothes.find({ type: 'aso-oke' }).limit(5),
      Clothes.find({ type: 'dansiki' }).limit(5),
      Clothes.find({ type: 'gele' }).limit(5),
      Clothes.find({ type: 'lace' }).limit(5),
      Clothes.find({ type: 'bogolanfini' }).limit(5),
      Clothes.find({ type: 'kente' }).limit(5),
      Clothes.find({ type: 'senufoCloth' }).limit(5),
      Clothes.find({ type: 'shweshwe' }).limit(5),
    ];

    const [ankara, asoOke, dansiki, gele, lace, bogolanfini, kente, senufoCLoth, shweshwe] = await Promise.all(promises);

    // Prepare preview data object
    const previewData = {
      ankara,
      asoOke,
      dansiki,
      gele,
      lace,
      bogolanfini,
      kente,
      senufoCLoth,
      shweshwe,
    };

    // Cache the preview data for future requests
    await client.set('preview', JSON.stringify(previewData));
    await client.expire('preview', 60 * 30); // One hour expiration

    res.json({previewData});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// console






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
    
        if (customer) {
          const cartItems = customer.cart.map(async (itemId) => {
            const item = await Clothes.findById(itemId); 
            return item;
          });
    
          const resolvedCartItems = await Promise.all(cartItems);
          res.json({ cartItems: resolvedCartItems, initialItems: resolvedCartItems});
        } else {
          return res.status(404).json({ message: 'User not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });


    app.post('/api/search', async (req, res) => {  
      const { searchTerm } = req.body; 
     console.log(req.query)
     console.log(req.params)
     console.log(req.body)
      try {
          console.log(`this is ${searchTerm}`)
        const searchOptions = {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { type: { $regex: searchTerm, $options: 'i' } },
            { color: { $regex: searchTerm, $options: 'i' } },
            { gender: { $regex: searchTerm, $options: 'i' } },
            { tribe: { $regex: searchTerm, $options: 'i' } },
          ],
        };
    
        const result = await Clothes.find(searchOptions);
        res.json({result});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving products' });
      }
    });

    app.post('/api/aboutItem', async (req,res) =>{
           const {id} = req.body;

           try {
            const item = await Clothes.findById(id)
            if (item){           
              return res.json({success: true, item})
            }
           }
           catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
            }
    })



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
    




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
