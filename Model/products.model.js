//imported mongoose from mongoose
import mongoose from "mongoose";

//created schema from mongoose for storing the user data
const {Schema} = mongoose;

const productsSchema = new Schema({
    name:String,
    price:Number,
    description:String,
    productQuantity:Number,
});

//created productModel for productSchema
const productModel = mongoose.model("products",productsSchema);
export default productModel; 