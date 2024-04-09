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
const app = express();


app.use(cors());

const redis = require('redis');




const dburl = process.env.dburl



app.use(express.json());

const client = redis.createClient({
  url:process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD
});

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

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.text());

  const targetURL = 'https://github.com/Afayomide';

  function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 
      const now = Date.now() / 1000; 
      if (decoded.exp < now) {
        console.warn('JWT has expired!');
        return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
      }
      else{
      }
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
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

    

// app.get("/api/clothespreview", async (req, res) => {
//   try {
//     const cachedPreview = await client.get('preview'); 
//     if(cachedPreview){

//     }
// else{
//     const promises = [
//       Clothes.find({ type: 'ankara' }).limit(5),
//       Clothes.find({ type: 'aso-oke' }).limit(5),
//       Clothes.find({ type: 'dansiki' }).limit(5), 
//       Clothes.find({ type: 'gele' }).limit(5), 
//       Clothes.find({ type: 'lace' }).limit(5), 
//       Clothes.find({ type: 'bogolanfini' }).limit(5), 
//       Clothes.find({ type: 'kente' }).limit(5), 
//       Clothes.find({ type: 'senufoCloth' }).limit(5), 
//       Clothes.find({ type: 'shweshwe' }).limit(5), 

//     ];

//     const [
//       ankara,
//       asoOke,
//       dansiki,
//       gele,
//       lace,
//       bogolanfini,
//       kente,
//       senufoCLoth,
//       shweshwe] = await Promise.all(promises);

//     res.json({ ankara,asoOke, dansiki, gele, lace, bogolanfini,kente, senufoCLoth,shweshwe});
//     console.log("found 5")
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

app.get("/api/clothespreview", async (req, res) => {
  try {
    const cachedPreview = await client.get('preview');

    if (cachedPreview) {
      console.log("Using cached preview data");
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

    console.log("Fetched cloth preview data from database");
    console.log(previewData)
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



    // app.post('/api/search', async (req, res) => {  
    //   const { searchTerm } = req.body; 
    //  console.log(req.query)
    //  console.log(req.params)
    //  console.log(req.body)
    //  try {
    //         const allProducts = await Clothes.find()
    //         const result = allProducts.filter(product =>
    //           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //           product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //           product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //           product.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //           product.tribe.toLowerCase().includes(searchTerm.toLowerCase()) 
    //         );
    //     res.json({result});
    //     console.log(result)
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Error retrieving products' });
    //   }
    // });


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
    




const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
