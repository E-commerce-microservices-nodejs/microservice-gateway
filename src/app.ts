import express from "express";
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import gatewayRouter from "./routes/api/gatewayRoutes";
import UserModel from "./models/UserModel";

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
    process.env.MONGO_URI as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions
  )
  .then(() => {

    console.log("Connected to database");
    const defaultCustomer={
      email: 'riad@gmail.com',
      password: "1234",
      token:null,
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
