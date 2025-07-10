const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const path = require('path');
const Product = require('../models/productModel');
const User = require('../models/userModel');

let cookie;

beforeAll(async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test-db';
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany();
  await Product.deleteMany();

  const newUser = new User({
    name: "Test User",
    email: "testuser@test.com",
    password: "Test$1234",
    role: "Admin"
  });

  await newUser.save();

  const loginRes = await request(app)
    .post('/user/userLogin')
    .send({
      email: "testuser@test.com",
      password: "Test$1234"
    });

  cookie = loginRes.headers['set-cookie'];
});

describe('Product Controller', () => {
  it('should create a new product for admin', async () => {
    const imagePath = path.join(__dirname, '../uploads/products/Butter-min.webp');
    
    const res = await request(app)
      .post('/mfd/admin/products/new')
      .set('Cookie', cookie)
      .field('name', 'Product name')
      .field('price', 100)
      .field('category', 'Milk')
      .field('description', 'a test description')
      .field('stock', 6)
      .attach('image', imagePath);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.product).toBeDefined();
  });

  it('should fetch all products with pagination and filtering', async () => {
    await Product.insertMany([
      {
        name: "Fresh Milk",
        price: 150,
        description: "Test Product",
        category: "Milk",
        stock: 5,
        user: new mongoose.Types.ObjectId(),
        image: "myPic.png"
      },
      {
        name: "Fresh Ghee",
        price: 200,
        description: "Test Product",
        category: "Ghee",
        stock: 5,
        user: new mongoose.Types.ObjectId(),
        image: "myPic2.png"
      }
    ]);

    const res = await request(app).get('/mfd/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body.resPerPage).toBe(4);
  });

  it('should fetch a single product by ID', async () => {
    const newProduct = await Product.create({
      name: 'Test Products',
      price: 100,
      description: 'testing product description',
      category: 'Milk',
      stock: 10,
      user: new mongoose.Types.ObjectId(),
      image: 'myPic3'
    });

    const res = await request(app).get(`/mfd/products/${newProduct._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product).toBeDefined();
  });

  it('should update a product by ID for admin', async () => {
    const productToUpdate = await Product.create({
      name: 'Test Product',
      price: 100,
      description: 'testing product description',
      category: 'Milk',
      stock: 10,
      user: new mongoose.Types.ObjectId(),
      image: 'myPic3'
    });

    const res = await request(app)
      .put(`/mfd/admin/products/${productToUpdate._id}`)
      .set('Cookie', cookie)
      .send({
        name: 'Updated Product',
        price: 150,
        description: 'updated description',
        category: 'Milk',
        stock: 9
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product.name).toBe('Updated Product');
  });

  it('should delete a product by ID for admin', async () => {
    const productToDelete = await Product.create({
      name: 'Test Product',
      price: 100,
      description: 'testing product description',
      category: 'Milk',
      stock: 10,
      user: new mongoose.Types.ObjectId(),
      image: 'myPic3'
    });

    const res = await request(app)
      .delete(`/mfd/admin/products/${productToDelete._id}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBeDefined();
  });

  it('should allow an authenticated user to create a review', async () => {
    const product = await Product.create({
      name: 'Review Test Product',
      price: 100,
      description: 'Product for review test',
      category: 'Milk',
      stock: 10,
      user: new mongoose.Types.ObjectId(),
      image: 'test.png',
      reviews: []
    });

    const res = await request(app)
      .put('/mfd/review')
      .set('Cookie', cookie)
      .send({
        productId: product._id.toString(),
        rating: 4,
        comment: 'Great product!'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.reviews.length).toBe(1);
    expect(updatedProduct.reviews[0].comment).toBe('Great product!');
    expect(updatedProduct.reviews[0].rating).toBe(4);
    expect(Number(updatedProduct.ratings)).toBe(4);
  });
});











// const request = require('supertest');
// const mongoose = require('mongoose');
// const app = require('../app');
// const path = require('path');
// const Product = require('../models/productModel');
// const User = require('../models/userModel');
// const fs = require('fs');


// let cookie;

// beforeAll(async () => {
//   const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test-db';
//   await mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// });

// afterAll(async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
// });

// beforeEach(async ()=>{
//     await User.deleteMany();
//     await Product.deleteMany();

//     const newUser = new User({
//       name:"Test User",
//       email:"testuser@test.com",
//       password:"Test$1234",
//       role:"Admin"
//     });

//     await newUser.save();

//     const loginRes = await request(app)
//     .post('/user/userLogin')
//     .send({
//         email:"testuser@test.com",
//         password:"Test$1234"
//     })
//   cookie = loginRes.headers['set-cookie'];
// });

// describe('Product Controller',() =>{
//   it('should create a new product for admin',async () =>{
//      const imagePath = path.join(__dirname, '../uploads/products/Butter-min.webp');
//      const res = await request(app)
//      .post(`/mfd/admin/products/new`)
//      .set('Cookie',cookie)
//      .field('name', 'Product name')
//      .field('price', '100')
//      .field('category', 'Milk')
//      .field('description','a test description')
//      .field('ratings','4')
//      .field('stock',6)
//      .field('numOfReviews',4)
//      .attach('image', imagePath); 

//      expect(res.statusCode).toBe(201);
//   });
  
//   it('should fetch all products with pagination and filtering',async () =>{
//     await Product.insertMany([
//       {
//         name:"Fresh Milk",
//         price:"150",
//         description:"Test Product",
//         ratings:"4",
//         category:"Milk",
//         stock:"5",
//         numOfReviews:"3",
//         user: new mongoose.Types.ObjectId(),
//         image:"myPic.png"
//       },
//        {
//         name:"Fresh Ghee",
//         price:"200",
//         description:"Test Product",
//         ratings:"4",
//         category:"Ghee",
//         stock:"5",
//         numOfReviews:"3",
//         user: new mongoose.Types.ObjectId(),
//         image:"myPic2.png"
//       }
//     ]);
//      const res = await request(app)
//      .get('/mfd/products')

//      expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(Array.isArray(res.body.products)).toBe(true);
//     expect(res.body.products.length).toBeGreaterThan(0);
//     expect(res.body.resPerPage).toBe(4);
//   });

//   it('should fetch a single product by ID', async ()=>{
//     const newProduct = await Product.create({
//        name:'Test Products',
//        price: '100',
//        description: 'testing product description',
//        ratings: '4',
//        category: 'Milk',
//        stock: '10',
//        numOfReviews: '3',
//        user: new mongoose.Types.ObjectId(),
//        image: 'myPic3'
//     });

//     const res = await request(app)
//     .get(`/mfd/products/${newProduct._id}`)
    
//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.product).toBeDefined();
//   });

//   it('should update a product by ID for admin',async ()=>{
//     const productToUpdate = await Product.create({
//        name:'Test Product',
//        price: '100',
//        description: 'testing product description',
//        ratings: '4',
//        category: 'Milk',
//        stock: '10',
//        numOfReviews: '3',
//        user: new mongoose.Types.ObjectId(),
//        image: 'myPic3' 
//     });

//     const res = await request(app)
//     .put(`/mfd/admin/products/${productToUpdate._id}`)
//     .set('Cookie',cookie)
//     .send({
//         name:'Update Product',
//         price:'150',
//         description:'testing product updated',
//         ratings:'5',
//         category:'Milk',
//         stock:'9',
//         numOfReviews:'4',
//         user: new mongoose.Types.ObjectId(),
//         image:'myPic4'
//     });
//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.product).toBeDefined();
//   });

//   it('should delete a product by ID for admin',async () =>{
//     const productToDelete = await Product.create({
//        name:'Test Product',
//        price: '100',
//        description: 'testing product description',
//        ratings: '4',
//        category: 'Milk',
//        stock: '10',
//        numOfReviews: '3',
//        user: new mongoose.Types.ObjectId(),
//        image: 'myPic3' 
//     });

//     const res = await request(app)
//     .delete(`/mfd/admin/products/${productToDelete._id}`)
//     .set('Cookie',cookie)

//     expect(res.statusCode).toBe(200)
//     expect(res.body.success).toBe(true)
//     expect(res.body.message).toBeDefined();
//   });

//   it('should allow an authenticated user to create a review', async () => {
//   const product = await Product.create({
//     name: 'Review Test Product',
//     price: '100',
//     description: 'Product for review test',
//     ratings: '0',
//     category: 'Milk',
//     stock: '10',
//     numOfReviews: '0',
//     user: new mongoose.Types.ObjectId(),
//     image: 'test.png',
//     reviews: []
//   });

//   const res = await request(app)
//     .put('/mfd/review') 
//     .set('Cookie', cookie)
//     .send({
//       productId: product._id.toString(),
//       rating: 4,
//       comment: 'Great product!'
//     });

//   expect(res.statusCode).toBe(200);
//   expect(res.body.success).toBe(true);

//   const updatedProduct = await Product.findById(product._id);

//   expect(updatedProduct.reviews.length).toBe(1);
//   expect(updatedProduct.reviews[0].comment).toBe('Great product!');
//   expect(updatedProduct.reviews[0].rating).toBe(4);
//   expect(Number(updatedProduct.ratings)).toBe(4);
// });
// })



