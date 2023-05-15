import express, { Request, Response } from 'express';
import axios from 'axios'

const productsServiceUrl = "http://localhost:5001/api";
const ordersServiceUrl = "http://localhost:5002/api";
const paymentServiceUrl = "http://localhost:5003/api";

const router=express.Router()

// Get list of products
router.get('/products', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${productsServiceUrl}/products`);
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
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve product information' });
  }
});
// get all orders
router.get('/orders', async (req: Request, res: Response) => {
    try {
      const response = await axios.get(`${ordersServiceUrl}/orders`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve orders' });
    }
  });
// Place an order
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${ordersServiceUrl}/orders`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
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
router.post('/orders/:orderId/payment', async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const response = await axios.post(`${paymentServiceUrl}/payment`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to request payment for the order' }).end();
  }
});

// Request marking the order as paid
router.post('/orders/:orderId/mark-paid', async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const response = await axios.post(`${ordersServiceUrl}/orders/${orderId}/mark-paid`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark the order as paid' });
  }
});

// Confirm payment
router.post('/payment/confirm', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${paymentServiceUrl}/payment/confirm`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Start the server
export =router