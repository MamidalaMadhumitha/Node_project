import productModel from "../Model/products.model.js";



//creating products with createProducts function
export function createProducts(req,res){
    const{name,price,description,productQuantity} = req.body;

    const newProduct =new productModel({
        name,
        price,
        description,
        productQuantity,       
    });

    newProduct.save()
    .then(data =>{
        if(!data){
            return res.status(404).json({success:false,error:"Product creation is not given"});
        }
        res.status(200).json({success:true,message:"product created successfully",data});
    })
    .catch((err)=>res.status(500).json({success:false,error:err.message || "Something went wrong"}));
}

// created a function for fetching all the products
export function fetchProducts(req,res){
    productModel.find()
    .then(data =>{
        if(!data){
            return res.status(404).json({success:false,error:"Products is not given"});
        }
        res.status(200).json({success:true,message:"product are given successfully",data});
    })
    .catch((err)=>res.status(500).json({success:false,error:err.message || "Something went wrong"}));
}

//created a function for fetching one product using id
export function fetchOneProduct(req,res){
    const _id = req.params.id;
    console.log(_id);
    productModel.findById(_id)
    .then(data =>{
        if(!data){
            return res.status(404).json({success:false,error:"Id not found"}); 
        }
        console.log({data});
        res.status(200).json({success:true,message:"fetched the product",data});
        
    })
};

//created a function for updating one product with the specific id
export function updateOneProduct(req,res){
    const _id=req.params.id;

    productModel.findByIdAndUpdate(_id,req.body)
    .then(data =>{
        if(!data){
            return res.status(404).json({success:true,error:"product is not updated"});
        }
        res.status(200).json({success:true,message:"product is updated",data});
    }) .catch((err)=>res.send(500).json({success:false,error:err.message ||"Id not found"}));
    
};

//created one function for deleting the product with specific id
export function deleteOneProduct(req,res){
    const _id = req.params.id;
    productModel.findByIdAndDelete(_id)
    .then(data=>{
        if(!data){
            return res.status(404).json({success:false,error:"Id not found"});
        }
        res.status(200).json({success:true,message:"found the product Id",data});
    })
    .catch((err)=>res.send(500).json({success:false,error:err.message ||"Id not found"}));
    
}


// created validation function for validation of products
export function validation(needed) {
    return (req, res, next) => {
      const missing = needed.filter((field) => !req.body[field]);
      if (missing.length > 0) {
        return res
          .status(400)
          .json({ message: `Missing required fields: ${missing}` });
      }
      next();
    };
  }