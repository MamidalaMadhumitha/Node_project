// importing the express framework
import express from "express";
import mongoose from "mongoose";
import { routes } from "./Routes/products.routes.js"
import { validation } from "./Controllers/products.controller.js";
import jwt from "jsonwebtoken";



// importing the express from express framework
const app = express();

const router = express.Router();
app.use("/",router)


//creating a server and connecting to mongod compass
app.listen("3200",async()=>{
    console.log("server is running on port 3200")
    const data = await mongoose.connect("mongodb+srv://Madhumitha:Madhumitha@cluster0.4s0le.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
   console.log(`Database connected with ${data.connection.host}`);
})

// Express.json for handling JSON data in RESTful APIs 
app.use(express.json());

routes(app);

const products=[
    {
        name: "Coconut Sugar",
        price: 300,
        description: "Natural sweetener made from coconut sap.",
        productQuantity: 500
      },
      {
        name: "Herbal Green Tea",
        price: 250,
        description: "Refreshing herbal green tea for relaxation.",
        productQuantity: 100
      },
      {
        name: "Dark Chocolate",
        price: 150,
        description: "Rich dark chocolate with 70% cocoa content.",
        productQuantity: 100
      },
      {
        name: "Almond Butter",
        price: 600,
        description: "Creamy almond butter made from roasted almonds.",
        productQuantity: 250
      }
]

//Adding a new product
app.post("/api/products",authenticateUser,validation(["name","price","description","productQuantity"]),
(req,res)=>{
    const{name,price,description,productQuantity}= req.body;
    const newProduct = {
        id:Math.random()*10,
        name:name,
        price:price,
        description:description,
        productQuantity:productQuantity,
    };
    if(!name||!price||!description||!productQuantity){
        return res.status(400).json({Message:"Invalid input"});
    }
    products.push(newProduct);
    res.status(201).send(products)
});



// created a login for Authenticate user and return a JWT token through login router
app.post("/login",(req,res)=>{
   const user = req.body.username;

   const accessToken = jwt.sign(user,"Madhumitha",{});

   res.send({token:accessToken});
});

// authenicating user 
 function authenticateUser(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split("")[1];

  jwt.verify(token,"Madhumitha",(err,user)=>{
    if(err){
      return res.status(403).json({message:"Invalid JWT Token"})
    }
    res.user = user;
    next();
  });
 };
