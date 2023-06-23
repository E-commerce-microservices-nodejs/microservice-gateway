import express from "express";
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import gatewayRouter from "./routes/api/gatewayRoutes";
import UserModel from "./models/UserModel";
import jwt from 'jsonwebtoken';
<<<<<<< HEAD

=======
import bcrypt from 'bcrypt'
>>>>>>> 779c85c32a914d1f534cc7272929745e35a3bf15
dotenv.config();

const app = express();

// middleware
// app.use(cors());
// app.use(helmet());
// app.use(morgan('tiny'));
app.use(express.json());

// routes
app.use("/api", gatewayRouter);





// database connection

mongoose
  .connect(
    `${process.env.MONGO_URI}`||'mongodb://mongodb-service/microservices',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions
  )
<<<<<<< HEAD
  .then(() => {

    console.log("Connected to database");
    const token = jwt.sign(
      {  email: 'riad@gmail.com',
      password: "1234",
      role:'customer',
      credit:9000},
=======
  .then(async() => {

    console.log("Connected to database");
    const encryptedPassword = await bcrypt.hash('1234', 10);

    const token = jwt.sign(
      {  email: 'elhajjaji@gmail.com',
      password: "1234",
      role:'customer',
      credit:9000
    },
>>>>>>> 779c85c32a914d1f534cc7272929745e35a3bf15
      `${process.env.TOKEN_KEY}`,
      {
        expiresIn: "2h",
      }
    );
    const defaultCustomer={
<<<<<<< HEAD
      email: 'riad@gmail.com',
      password: "1234",
=======
      email: 'elhajjaji@gmail.com',
      password: encryptedPassword,
>>>>>>> 779c85c32a914d1f534cc7272929745e35a3bf15
      token:token,
      role:'customer',
      credit:9000
    }
    
    UserModel.insertMany(defaultCustomer)
      .then(() => {
        console.log("Initial Products data inserted");
      })
      .catch((error) => {
        console.error("Error inserting initial product data:", error);
      });
  })
  .catch((error: Error) => {
    console.log(`Database connection error: ${error.message}`);
  });

export default app;
