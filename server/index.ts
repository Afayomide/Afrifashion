import { Request, Response } from "express";
import {
  aboutItem,
  allFabrics,
  contactUs,
  previewed,
  relatedItems,
  search,
  visitor,
} from "./controllers";
import axios from "axios";
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const redis = require("redis");
const cookieParser = require("cookie-parser");
const paymentRouter = require("./routes/customer/payments");
const cartRouter = require("./routes/customer/cart");
const customerAuthRouter = require("./routes/customer/auth");
const Product = require("./models/product")


const corsOptions = {
  origin: [    
    "https://afrifashion.vercel.app",
    "http://localhost:3000",
    "https://nativefabs.com",
    "https://www.nativefabs.com"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use("/api/cart", cartRouter);
app.use("/api", paymentRouter);
app.use("/api/auth/customer", customerAuthRouter);

const dburl = process.env.dburl || "";

app.use(express.json());

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: 10755,
  },
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis server successfully!");
  } catch (error) {
    console.log("Error connecting to Redis:", error);
  }
})();

declare global {
  namespace Express {
    interface Request {
      user?: any; // or you can specify a type for `user`, e.g., `User`
      file?: any;
      admin?: any;
      cookies: { [key: string]: string };
    }
  }
}

async function connectToMongo(dburl: string) {
  const retryAttempts = 3;
  const connectTimeoutMS = 20000;

  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      await mongoose.connect(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS,
      });
      console.log("Connected to Database");
      return;
    } catch (error: any) {
      console.error(`Connection attempt ${attempt} failed:`, error.message);

      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(attempt * 2000, 10000))
      );
    }
  }

  throw new Error("Failed to connect to MongoDB Atlas after retries");
}

connectToMongo(dburl)
  .then(() => {
    console.log("connection succesful");
  })
  .catch((error) => {
    console.error("Fatal error:", error.message);
  });

const targetURL = "https://github.com/Afayomide";

app.get("/", (req: Request, res: Response) => {
  res.send("welcome");
});

app.get("/api", (req: Request, res: Response) => {
  res.redirect(targetURL);
});

app.route("/api/contactUs").post(contactUs);

app.route("/api/fabrics").get(allFabrics);
app.route("/api/clothespreview").get(previewed);

app.route("/api/search").post(search);

app.route("/api/aboutItem/:productId").get(aboutItem);

app.route("/api/related-items/:productId").get(relatedItems);
app.route("/api/visitor").post(visitor)

app.post("/api/changeFab", async (req:Request,res:Response) =>{
 var clothes = await Product.find()
 const imageUrls = [
  "https://www.dropbox.com/scl/fi/kqwc9t4mq1oicmpjwlyle/VL-8070_large.png?rlkey=1xogn72vn161urqqitgkfov01&st=sogx2kbk&raw=1",
  "https://www.dropbox.com/scl/fi/xouzlfudehty2l6vgq3zj/VL-8053_large.png?rlkey=t7phcqbcc2y8wqxx85f4aqs6f&st=57eduw3s&raw=1",
  "https://www.dropbox.com/scl/fi/33f0n6djkow6oetj8r25u/VL-8047_c03ee297-8594-4a67-9f36-de12f0901de7_large.png?rlkey=je7tq3quvaxq70o8pssnkfgrp&st=4tmo857s&raw=1",
  "https://www.dropbox.com/scl/fi/kk0bi8kgyyi79njve3ajh/SP-8004_large.png?rlkey=rz0trpb0pcb0jxnvrty7m0347&st=0r8gigzg&raw=1",
  "https://www.dropbox.com/scl/fi/aiy13l7a0jvskrbw1ntox/OT-3021_large.png?rlkey=bqzomsmhw6kct9h2sw896iuf8&st=c1n709cp&raw=1",
  "https://www.dropbox.com/scl/fi/4ev0ch9rpn9p8rq7s97qv/OT-3005-2_large.png?rlkey=0dj6mnpyd4xj8v8p7hcbgxsk3&st=wtt5eiuu&raw=1",
  "https://www.dropbox.com/scl/fi/so6zcjiki4cp3pb2yq4lq/KT-3120_large.png?rlkey=0n6g5u1wwnjign2rwe5sw4pvy&st=kl07b2cg&raw=1",
  "https://www.dropbox.com/scl/fi/996aeqmhgo03cpbz3wywx/KT-3117_large.png?rlkey=pgxaw7lmkup9tlghby8kjqeqh&st=j6bn4vhm&raw=1",
  "https://www.dropbox.com/scl/fi/h48ae4frblbn1zsxbbaxg/AF-4045_large.png?rlkey=pjyctyltyc4ye46qadz4lm65a&st=12vyxlb8&raw=1",
  "https://www.dropbox.com/scl/fi/hfqoqmc41gv1atnjrq5ru/AF-4034_large.png?rlkey=qgylnpqdgokm8ug601l4cqyry&st=8d35fqcz&raw=1",
  "https://www.dropbox.com/scl/fi/fephm8azriwp74jds8hne/AF-3994_large.png?rlkey=vjntpzp1mloxztjnw9hcv69r0&st=j0pme8do&raw=1",
  "https://www.dropbox.com/scl/fi/kqwc9t4mq1oicmpjwlyle/VL-8070_large.png?rlkey=1xogn72vn161urqqitgkfov01&st=1d915eyx&raw=1",
  "https://www.dropbox.com/scl/fi/xouzlfudehty2l6vgq3zj/VL-8053_large.webp?rlkey=t7phcqbcc2y8wqxx85f4aqs6f&st=5zsfm951&raw=1",
  "https://www.dropbox.com/scl/fi/466c3fgcxa0gqwcl80dij/VL-8043_large.webp?rlkey=vhrwtxmwfd8jzi9en86xg2p2z&st=u27n6kf1&raw=1"
];

for (var i = 0; i < clothes.length; i++){
  clothes[i].image = imageUrls[i]  
  await clothes[i].save()
}

 return res.json({clothes})
})

app.get("/api/getLocation", async (req:Request, res:Response) => {
  const ipAddress = req.ip;
  try {
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    const data = response.data;

    if (data.status === "fail") {
      console.log("Failed to get location data:", data.message);
      return null;
    }

    console.log("Location data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


