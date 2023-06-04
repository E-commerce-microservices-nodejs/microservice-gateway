import express, { Request, Response } from 'express';
import axios from 'axios'
import dotenv from 'dotenv';
import UserModel from '../../models/UserModel';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import AuthenticateUser from '../../middelwares/AuthenticateUser';

// microservices's hostname
dotenv.config();
const productsServiceUrl = `${process.env.PRODUCTS_SERVER}`;
const ordersServiceUrl = `${process.env.ORDERS_SERVER}`;
const paymentServiceUrl = `${process.env.PAYMENT_SERVER}`;

const router=express.Router();

// Middleware to enable CORS
router.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Get list of products
router.get('/products', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${productsServiceUrl}/products`);
    console.log(req.url)
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Get information about a product
router.get('/products/:productId', async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    const response = await axios.get(`${productsServiceUrl}/products/${productId}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve product information' });
  }
});
// get all orders
router.get('/orders', async (req: Request, res: Response) => {
    try {
      const response = await axios.get(`${ordersServiceUrl}/orders`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve orders' });
     

    }
  });
// Place an order
router.post('/orders', async (req: Request, res: Response) => {
  try {
        console.log('I am in gateway To orders ....')

    const response = await axios.post(`${ordersServiceUrl}/orders`, req.body);
    res.json(response.data);

  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
    console.log('I am in gateway To orders but failed ....')

  }
});

// Retrieve the created order
router.get('/orders/:orderId', async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const response = await axios.get(`${ordersServiceUrl}/orders/${orderId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

// Request payment for the order
router.post('/orders/payment', async (req: Request, res: Response) => {
  
  try {
    console.log(req.body)
    const response = await axios.post(`${paymentServiceUrl}/payment`,req.body);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to request payment for the order' }).end();
  }
});

// Request marking the order as paid
// router.post('/orders/:orderId/mark-paid', async (req: Request, res: Response) => {
//   const { orderId } = req.params;
//   try {
//     const response = await axios.post(`${ordersServiceUrl}/orders/${orderId}/mark-paid`);
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to mark the order as paid' });
//   }
// });

// // Confirm payment
// router.post('/payment/confirm', async (req: Request, res: Response) => {
//   try {
//     const response = await axios.post(`${paymentServiceUrl}/payment/confirm`, req.body);
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to confirm payment' });
//   }
// });


// authentication

// ...

router.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const {email, password,fullname,credit } = req.body;

    // Validate user input
    if (!(email && password && fullname && credit)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await UserModel.create({
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      fullname,
      credit,
      role:'user'

    });

    // Create token
    const token = jwt.sign(
      {email,password,fullname,credit },
      `${process.env.TOKEN_KEY}`,{
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user).end();
  } catch (err) {
    console.log(err);
  }
});


// login------------

router.post("/login", async (req, res) => {
  console.log("Login trigered....")
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("Signing processing....")

      const token = jwt.sign({ email, password }, `${process.env.TOKEN_KEY}`, {
        expiresIn: "2h",
      });
      console.log("Signing finished....")


      user.token = token;
      console.log("login finished....")

      return res.status(200).json(user);
    }
    console.log("Invalid Credentials....")

    return res.status(400).send("Invalid Credentials");
  } catch (err) {
        console.log("Internal server error....")

    console.log(err);

    return res.status(500).send("Internal Server Error");
  }
});


export =router