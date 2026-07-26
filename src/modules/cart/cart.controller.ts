import { Request, Response } from "express";
import { cartServer } from "./cart.server";

const addToCart = async (req: Request, res: Response) => {
    try {
        await cartServer.addToCart(req, res);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};

const getCart = async (req: Request, res: Response) => {
    try {
        await cartServer.getCart(req, res);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};

const updateCartItem = async (req: Request, res: Response) => {
    try {
        await cartServer.updateCartItem(req, res);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};

const removeCartItem = async (req: Request, res: Response) => {
    try {
        await cartServer.removeCartItem(req, res);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};

const checkout = async (req: Request, res: Response) => {
    try {
        await cartServer.checkout(req, res);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};

export const cartController = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    checkout,
};

export default cartController;
