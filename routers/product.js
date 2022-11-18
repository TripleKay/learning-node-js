const router = require("express").Router();
const {
   verifyToken,
   verifyTokenAndAdmin,
   verifyTokenAndAuthorization,
} = require("./verifyToken");
const Product = require("../models/Product");

//create product
router.post("/products", verifyTokenAndAdmin, async (req, res) => {
   try {
      const product = await new Product({
         title: req.body.title,
         categories: req.body.categories,
         description: req.body.description,
         image: req.body.image,
         size: req.body.size,
         color: req.body.color,
         price: req.body.price,
      });
      res.status(201).json(product);
   } catch (error) {
      res.status(500).json(error);
   }
});

//update product
router.put("/products/:id", verifyTokenAndAdmin, async (req, res) => {
   try {
      const data = getRequestProductData(req);
      const product = await Product.findByIdAndUpdate(req.params.id, data, {
         new: true,
      });
      res.status(200).json(product);
   } catch (error) {
      res.status(500).json(error);
   }
});

//product detail
router.get("/products/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    }catch(error){
        res.status(500).json(error);
    }
});

//product delete
router.delete("/products/:id",async (req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product deleted successfully!");
    } catch (error) {
        res.status(500).json(error);
    }
})

//product list
router.get("/products", async (req, res) => {
   const { page = 1, limit = 10 } = req.query;
   try {
      const products = await Product.find()
         .sort({ createdAt: -1 })
         .limit(limit * 1)
         .skip((page - 1) * limit);
      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
      const currentPage = page;
      res.status(200).json({
         products,
         totalProducts: totalProducts,
         totalPages: totalPages,
         currentPage: currentPage,
      });
   } catch (error) {
      res.status(500).json(error);
   }
});

//get product data
let getRequestProductData = (req) => {
    return {
        title: req.body.title,
        categories: req.body.categories,
        description: req.body.description,
        image: req.body.image,
        size: req.body.size,
        color: req.body.color,
        price: req.body.price,
     };
}

module.exports = router;
