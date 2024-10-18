
//imported the functions from controller.js 
import { createProducts,
     deleteOneProduct, 
     fetchOneProduct, 
     fetchProducts, 
     updateOneProduct,validation } from "../Controllers/products.controller.js";

//created api routes for routing      
export function routes(app){
    // adding new products
    app.post("/api/products",validation(["name","price","description","productQuantity"]),createProducts);

    // fetching the products through get method
    app.get("/api/products",fetchProducts);

    //fetching the product Id  through get method
    app.get("/api/product/:id",fetchOneProduct);

    //updating the products through put method
    app.put("/api/product/:id",validation(["name","price","description","productQuantity"]),updateOneProduct);

    //deleting the products through delete method
    app.delete("/api/product/:id",deleteOneProduct);

}