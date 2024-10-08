const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Clothes = require("./models/clothesSchema")
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const redis = require('redis');
const cookieParser = require('cookie-parser');
const paymentRouter = require('./routes/payments');
const cartRouter = require('./routes/cart')
const nodemailer = require("nodemailer")
const adminAuthRouter = require("./routes/admin")
const adminRouter = require("./routes/admin")
const customerAuthRouter = require("./routes/auth/customerAuth")


const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URL,
        port: 10755
    }
});

const corsOptions = {
  origin: ['http://localhost:5000', 'https://coolafristyles.web.app','https://afrifashion.vercel.app'],  
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
app.use("/api/cart", cartRouter)
app.use('/api', paymentRouter)
app.use("/api/admin", adminRouter)
app.use("/api/auth/customer", customerAuthRouter)
app.use("/api/auth/admin", adminAuthRouter)

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



app.get("/api/fabrics",async(req,res) => {
  
    try {
        // const cachedFabrics = await client.get('fabrics');

        // if (cachedFabrics) {
        //   console.log("using cached")
        //   return res.json({fabrics : JSON.parse(cachedFabrics)});
        // } 
        // else{

       const fabrics = await Clothes.find();
         if(fabrics) {      
          await client.set('fabrics', JSON.stringify(fabrics));
          await client.expire('fabrics', 60 * 30); 
             res.json({fabrics});
         }
 
         else {
           return res.status(404).json({ message: 'no fabric found' });
         }
        // }
                   
 
     
       } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Internal server error' });
       }
     });

    
app.get("/api/clothespreview", async (req, res) => {
  try {
    // const cachedPreview = await client.get('preview');

    // if (cachedPreview) {
    //   return res.json({previewData: JSON.parse(cachedPreview)});
    // }

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

    app.get("/api/related-items/:fabricId", async(req,res)=>{
      try {
        const { fabricId } = req.params;

        // Find the fabric by ID
        const fabric = await Clothes.findById(fabricId);
        if (!fabric) {
            return res.status(404).json({ message: 'Fabric not found' });
        }

        // Find related items based on color, fabricType, or pattern
        const relatedItems = await Clothes.find({
            _id: { $ne: fabric._id },  // Exclude the current fabric
            $or: [
                { color: fabric.color },
                { type: fabric.fabricType },
                { pattern: fabric.pattern }
            ]
        }).limit(8);

        res.status(200).json({success: true, relatedItems});
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
    })


    // async function getAll () {
    //   const allFabs = await Clothes.find()

    //   for (var fab of allFabs) {
    //     if(fab.quantity === 0) {
    //       fab.quantity = 10; // Update quantity to 10
    //       await fab.save();  // Save the updated fabric
    //     }
    //   }
    // }
    // async function updateOutOfStockStatus() {
    //   const allFabs = await Clothes.find(); // Fetch all clothes
    
    //   for (var fab of allFabs) {
    //     if (fab.quantity === 0) {
    //       fab.outOfStock = true; // Mark as out of stock
    //     } else {
    //       fab.outOfStock = false; // In stock
    //     }
    //     await fab.save();  // Save the updated fabric
    //   }
    // }

    // updateOutOfStockStatus()

    // async function updateOutOfStockStatus() {
    //   const allFabs = await Clothes.find(); // Fetch all clothes
    
    //   for (var fab of allFabs) {
    //     fab.description = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"]
    //     await fab.save();  // Save the updated fabric
    //   }
    // }

    
    // updateOutOfStockStatus()




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
