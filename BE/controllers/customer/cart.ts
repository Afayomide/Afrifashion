import { Request, Response } from "express";
import "dotenv/config";
import Customer from "../../models/customer";
import Product from "../../models/product";
import { Types } from "mongoose";

interface AuthRequest extends Request {
  user: {
    userId: string;
  };
}

export const cartList = async (req: Request, res: Response) => {
  const id = (req as AuthRequest).user.userId;

  try {
    const customer = await Customer.findById(id);

    if (customer) {
      const cartItems = customer.cart.map(async (itemId) => {
        const item = await Product.findById(itemId);
        return item;
      });

      const resolvedCartItems = await Promise.all(cartItems);
      res.json({ cartItems: resolvedCartItems, initialItems: resolvedCartItems });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getCart = async (req: Request, res: Response) => {
  const id = (req as AuthRequest).user.userId;
  try {
    const customer = await Customer.findById(id);
    if (customer) {
      const cartLength = customer.cart.length;
      const fullName = customer.fullname
      const email = customer.email
      res.json({ cartLength, fullName, email });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const addToCart = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user.userId;
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Missing product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const customer = await Customer.findById(userId);
    if (customer) {
      const existingProduct = customer.cart.find((item) => item.toString() === productId);
      if (existingProduct) {
        return res.status(400).json({ message: 'Product already in cart' });
      }
      else {
        customer.cart.push(product._id as Types.ObjectId);
        await customer.save();
      }

    }
    res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const deleteFromCart = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user.userId;
  const { productId } = req.body;

  try {
    const customer = await Customer.findById(userId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const updatedCart = customer.cart.filter((item) => item.toString() !== productId.toString());
    customer.cart = updatedCart;

    await customer.save();

    res.json({ message: 'Item deleted from cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}