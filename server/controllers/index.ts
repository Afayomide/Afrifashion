import { Request, Response } from "express";
const Products = require("../models/product");
require("dotenv").config();
const redis = require("redis");
const nodemailer = require("nodemailer");

const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_URL,
      port: 10755,
    },
  });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

export const allFabrics = async (req: Request, res: Response) => {
    try {
      // const cachedFabrics = await client.get('fabrics');
  
      // if (cachedFabrics) {
      //   console.log("using cached")
      //   return res.json({fabrics : JSON.parse(cachedFabrics)});
      // 
      // else{
  
      const fabrics = await Products.find();
      if (fabrics) {
        // await client.set("fabrics", JSON.stringify(fabrics));
        // await client.expire("fabrics", 60 * 30);
        res.json({ fabrics });
      } else {
        return res.status(404).json({ message: "no fabric found" });
      }
      // }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

export const previewed = async (req: Request, res: Response) => {
    try {
      // const cachedPreview = await client.get('preview');
  
      // if (cachedPreview) {
      //   return res.json({previewData: JSON.parse(cachedPreview)});
      // }
  
      const promises = [
        Products.find({ category: "ankara" }).limit(5),
        Products.find({ category: "aso-oke" }).limit(5),
        Products.find({ category: "dansiki" }).limit(5),
        Products.find({ category: "gele" }).limit(5),
        Products.find({ category: "lace" }).limit(5),
        Products.find({ category: "bogolanfini" }).limit(5),
        Products.find({ category: "kente" }).limit(5),
        Products.find({ category: "senufoCloth" }).limit(5),
        Products.find({ category: "shweshwe" }).limit(5),
      ];
  
      const [
        ankara,
        asoOke,
        dansiki,
        gele,
        lace,
        bogolanfini,
        kente,
        senufoCLoth,
        shweshwe,
      ] = await Promise.all(promises);
  
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
    //   await client.set("preview", JSON.stringify(previewData));
    //   await client.expire("preview", 60 * 30); // One hour expiration
  
      res.json({ previewData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  export const search = async (req: Request, res: Response) => {
    const { searchTerm } = req.body;
   
    try {
      const searchOptions = {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { type: { $regex: searchTerm, $options: "i" } },
          { color: { $regex: searchTerm, $options: "i" } },
          { gender: { $regex: searchTerm, $options: "i" } },
          { tribe: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
        ],
      };
  
      const result = await Products.find(searchOptions);
      res.json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving products" });
    }
  }
export const aboutItem = async (req: Request, res: Response) => {

    try {      
         const { productId } = req.params;
      const item = await Products.findById(productId);
      if (item) {
        return res.json({ success: true, item });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  export const relatedItems = async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
  
      // Find the fabric by ID
      const item = await Products.findById(productId);
      if (!item) {
        return res.status(404).json({ message: "Fabric not found" });
      }
  
      // Find related items based on color, fabricType, or pattern
      const relatedItems = await Products.find({
        _id: { $ne: item._id }, // Exclude the current fabric
        $or: [
          { color: item.color },
          { type: item.type },
          { category: item.category },
          { pattern: item.pattern },
        ],
      }).limit(8);
  
      res.status(200).json({ success: true, relatedItems });
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error });
    }
  }

export const contactUs = async (req: Request, res: Response) => {
    const { email, fullName, message, subject } = req.body;
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: subject,
        text: `full Name: ${fullName} \n Email: ${email} \n ${message} `,
      };
      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.json(error);
    }
  }

  export const visitor =  async (req:Request, res:Response) => {
 
    const {route ,userLocation} = req.body
try{
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'adotchris7@gmail.com',
    subject: `New Visitor${userLocation.ipaddress}`,
    text: `Visitor in \n country : ${userLocation.country}} \n address :${userLocation.ipaddress} visited Afroroyals at \n route: ${route}`,
  };
  await transporter.sendMail(mailOptions);
  res.json({ success: true });
}
catch(error){
res.json(error)
}
  }