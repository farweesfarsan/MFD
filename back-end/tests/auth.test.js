// const request = require('supertest');
// const mongoose = require('mongoose');
// const app = require('../app');
// const path = require('path');
// const User = require('../models/userModel');
// const sendEmail = require('../utils/emailServer');
// const fs = require('fs');

// jest.mock('../utils/emailServer', () => jest.fn().mockResolvedValue());
// jest.setTimeout(15000); 
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

// beforeEach(async () => {
//   await User.deleteMany();

//   const user = new User({
//     name: 'Test User',
//     email: 'testuser@example.com',
//     password: 'Test@1234',
//     role: 'Admin',
//   });
//   await user.save();

//   const loginRes = await request(app)
//     .post('/user/userLogin')
//     .send({
//       email: 'testuser@example.com',
//       password: 'Test@1234',
//     });

//   cookie = loginRes.headers['set-cookie'];
// });

// describe('Auth Controller', () => {
//   it('should register a user', async () => {
//     const res = await request(app)
//       .post('/user/register')
//       .send({
//         name: 'New User',
//         email: 'newuser@example.com',
//         password: 'New@1234',
//       });

//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty('token');
//   });

//   it('login a user', async () => {
//     const res = await request(app)
//       .post('/user/userLogin')
//       .send({
//         email: 'testuser@example.com',
//         password: 'Test@1234',
//       });

//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty('token');
//   });

//   it('logout a user and clear the cookie', async () => {
//     const res = await request(app)
//       .get('/user/userLogout');

//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.message).toBe('Logout User');

//     const cookieHeader = res.headers['set-cookie'][0];
//     expect(cookieHeader).toContain('token=');
//     expect(cookieHeader).toContain('Expires=');
//     expect(cookieHeader).toContain('HttpOnly');
//   });

//   it('return 404 if forgot password email is not found', async () => {
//     const res = await request(app)
//       .post('/user/password/forgot')
//       .send({ email: 'nonexistent@example.com' });

//     expect(res.status).toBe(404);
//     expect(res.body).toMatchObject({
//       success: false,
//       message: 'User not found with this email',
//     });
//   });

//   it('send reset email if user exists', async () => {
//     const user = new User({
//       name: 'Jane Doe',
//       email: 'jane@example.com',
//       password: 'Jane@1234',
//     });
//     await user.save();

//     const res = await request(app)
//       .post('/user/password/forgot')
//       .send({ email: 'jane@example.com' });

//     expect(res.statusCode).toBe(200);
//     expect(sendEmail).toHaveBeenCalledTimes(1);
//     expect(sendEmail).toHaveBeenCalledWith(
//       expect.objectContaining({
//         email: 'jane@example.com',
//         subject: 'MFD Password Recovery',
//       })
//     );
//     expect(res.body.success).toBe(true);
//     expect(res.body.message).toContain('Email sent to');
//   });

//   it('should return the user profile for authenticated user via cookie', async () => {
//     const profileRes = await request(app)
//       .get('/user/myProfile')
//       .set('Cookie', cookie);

//     expect(profileRes.statusCode).toBe(200);
//     expect(profileRes.body.success).toBe(true);
//     expect(profileRes.body.user.email).toBe('testuser@example.com');
//     expect(profileRes.body.user.name).toBe('Test User');
//   });

//   it('should change the user password if old password is correct', async () => {
//     const res = await request(app)
//       .put('/user/password/change')
//       .set('Cookie', cookie)
//       .send({
//         oldPassword: 'Test@1234',
//         password: 'NewPassword456',
//       });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.success).toBe(true);
//   });

//   it('should update name, email, and avatar', async () => {
//     const res = await request(app)
//       .put('/user/update')
//       .set('Cookie', cookie)
//       .field('name', 'Updated Name with Avatar')
//       .field('email', 'avatar@example.com')
//       .attach('avatar', path.join(__dirname, '../uploads/user/Lakshan.jpg'));

//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.user.name).toBe('Updated Name with Avatar');
//     expect(res.body.user.avatar).toContain('/uploads/user/');
//   }, 30000); 

//   it('should return all users for admin', async () => {
//     const res = await request(app)
//       .get('/user/admin/users')
//       .set('Cookie', cookie);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(Array.isArray(res.body.users)).toBe(true);
//     expect(res.body.users.length).toBeGreaterThan(0);
//     expect(res.body.users[0]).toHaveProperty('email');
//   });

//   it('should return a user by ID for admin', async () => {
//   const newUser = new User({
//     name: 'GetById User',
//     email: 'getbyid@example.com',
//     password: 'Test@1234',
//     role: 'user', 
//   });

//   await newUser.save(); 
//   const res = await request(app)
//     .get(`/user/admin/users/${newUser._id}`)
//     .set('Cookie', cookie); 

//   expect(res.statusCode).toBe(200);
//   expect(res.body.success).toBe(true);
//   expect(res.body.user).toHaveProperty('email', 'getbyid@example.com');
//   expect(res.body.user).toHaveProperty('name', 'GetById User');
// });

// it('should update a user by ID for admin',async () => {
//   const userToUpdate = new User({
//     name:"Old Name",
//     email: "oldemail@example.com",
//     password:"Test$1234",
//     role: "user",
//   });

//   await userToUpdate.save();

//   const res = await request(app)
//   .put(`/user/admin/users/${userToUpdate._id}`)
//   .set('Cookie',cookie)
//   .send({
//     name:"Updated name",
//     email:"updated@tested.com",
//     password:"Update$1234",
//     role:"delivery staff"
//   });

//   expect(res.statusCode).toBe(200);
//   expect(res.body.success).toBe(true);
//   expect(res.body.user.name).toBe('Updated name');
//   expect(res.body.user.email).toBe('updated@tested.com');
//   expect(res.body.user.role).toBe('delivery staff');
// });

// it("should delete a user by ID for admin", async () =>{

//   const userToDelete = new User({
//     name:"User name",
//     email:"user@test.com",
//     password:"Test$1234"
//   });

//   await userToDelete.save();

//   const res = await request(app)
//   .delete(`/user/admin/users/${userToDelete._id}`)
//   .set('Cookie',cookie);

//   expect(res.statusCode).toBe(200);
//   expect(res.body.success).toBe(true);
// })

// });
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const path = require('path');
const User = require('../models/userModel');
const sendEmail = require('../utils/emailServer');

jest.mock('../utils/emailServer', () => jest.fn().mockResolvedValue());
jest.setTimeout(15000);

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

  const user = new User({
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'Test@1234',
    role: 'Admin', // MATCHING ENUM
  });
  await user.save();

  const loginRes = await request(app)
    .post('/user/userLogin')
    .send({
      email: 'testuser@example.com',
      password: 'Test@1234',
    });

  cookie = loginRes.headers['set-cookie'];
});

describe('Auth Controller', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'New@1234',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('login a user', async () => {
    const res = await request(app)
      .post('/user/userLogin')
      .send({
        email: 'testuser@example.com',
        password: 'Test@1234',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('logout a user and clear the cookie', async () => {
    const res = await request(app).get('/user/userLogout');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Logout User');

    const cookieHeader = res.headers['set-cookie'][0];
    expect(cookieHeader).toContain('token=');
    expect(cookieHeader).toContain('Expires=');
    expect(cookieHeader).toContain('HttpOnly');
  });

  it('return 404 if forgot password email is not found', async () => {
    const res = await request(app)
      .post('/user/password/forgot')
      .send({ email: 'nonexistent@example.com' });

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      success: false,
      message: 'User not found with this email',
    });
  });

  it('send reset email if user exists', async () => {
    const user = new User({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Jane@1234',
    });
    await user.save();

    const res = await request(app)
      .post('/user/password/forgot')
      .send({ email: 'jane@example.com' });

    expect(res.statusCode).toBe(200);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'jane@example.com',
        subject: 'MFD Password Recovery',
      })
    );
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Email sent to');
  });

  it('should return the user profile for authenticated user via cookie', async () => {
    const profileRes = await request(app)
      .get('/user/myProfile')
      .set('Cookie', cookie);

    expect(profileRes.statusCode).toBe(200);
    expect(profileRes.body.success).toBe(true);
    expect(profileRes.body.user.email).toBe('testuser@example.com');
    expect(profileRes.body.user.name).toBe('Test User');
  });

  it('should change the user password if old password is correct', async () => {
    const res = await request(app)
      .put('/user/password/change')
      .set('Cookie', cookie)
      .send({
        oldPassword: 'Test@1234',
        password: 'NewPassword456',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should update name, email, and avatar', async () => {
    const res = await request(app)
      .put('/user/update')
      .set('Cookie', cookie)
      .field('name', 'Updated Name with Avatar')
      .field('email', 'avatar@example.com')
      .attach('avatar', path.join(__dirname, '../uploads/user/Lakshan.jpg'));

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.name).toBe('Updated Name with Avatar');
    expect(res.body.user.avatar).toContain('/uploads/user/');
  });

  it('should return all users for admin', async () => {
    const res = await request(app)
      .get('/user/admin/users')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBeGreaterThan(0);
    expect(res.body.users[0]).toHaveProperty('email');
  });

  it('should return a user by ID for admin', async () => {
    const newUser = new User({
      name: 'GetById User',
      email: 'getbyid@example.com',
      password: 'Test@1234',
      role: 'user',
    });

    await newUser.save();

    const res = await request(app)
      .get(`/user/admin/users/${newUser._id}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty('email', 'getbyid@example.com');
    expect(res.body.user).toHaveProperty('name', 'GetById User');
  });

  it('should update a user by ID for admin', async () => {
    const userToUpdate = new User({
      name: 'Old Name',
      email: 'oldemail@example.com',
      password: 'Test$1234',
      role: 'user',
    });

    await userToUpdate.save();

    const res = await request(app)
      .put(`/user/admin/users/${userToUpdate._id}`)
      .set('Cookie', cookie)
      .send({
        name: 'Updated name',
        email: 'updated@tested.com',
        role: 'DeliveryStaff',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.name).toBe('Updated name');
    expect(res.body.user.email).toBe('updated@tested.com');
    expect(res.body.user.role).toBe('DeliveryStaff');
  });

  it('should delete a user by ID for admin', async () => {
    const userToDelete = new User({
      name: 'User name',
      email: 'user@test.com',
      password: 'Test$1234',
      role: 'Customer',
    });

    await userToDelete.save();

    const res = await request(app)
      .delete(`/user/admin/users/${userToDelete._id}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User deleted successfully!');
  });
});



