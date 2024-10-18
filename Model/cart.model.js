const cartSchema = new mongoose.Schema(
    {
        // ID of the user owning the cart
      userId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the product added by user in cart
            ref: "Product",
          },
          quantity: { type: Number },
        },
      ],
      // Reference to the product saved for later
      savedForLater: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

      // Total amount of all products in the cart
      totalAmount: { type: Number, default: 0 },

       // Total amount after applying discounts
      totalOriginalPrice: { type: Number, default: 0 },
      
      // Total number of items in the cart
      totalItems: { type: Number, default: 0 }, 
    },
    { timestamps: true }
  );
  
  const Cart = mongoose.model("Cart", cartSchema);
  
  export default Cart;