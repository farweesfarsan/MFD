const products = require('../data/products.json');
const Product = require('../models/productModel');
const dotenv = require('dotenv');
const connectDb = require('../config/db');

dotenv.config({path:'config/.env'});
connectDb();

const seedProduct = async ()=>{
    try {
    await Product.deleteMany();
    console.log('Products deleted');
    await Product.insertMany(products);
    console.log('All Products deleated');

    } catch (error) {
       console.log(error.message);
    } 
    process.exit();  
}

seedProduct();