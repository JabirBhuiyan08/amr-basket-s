import { cartServer } from "./cart.server";
const addToCart = async (req, res) => {
    try {
        await cartServer.addToCart(req, res);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const getCart = async (req, res) => {
    try {
        await cartServer.getCart(req, res);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const updateCartItem = async (req, res) => {
    try {
        await cartServer.updateCartItem(req, res);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const removeCartItem = async (req, res) => {
    try {
        await cartServer.removeCartItem(req, res);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const checkout = async (req, res) => {
    try {
        await cartServer.checkout(req, res);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Something went wrong",
        });
    }
};
const mergeCart = async (req, res) => {
    try {
        await cartServer.mergeCart(req, res);
    }
    catch (error) {
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
    mergeCart,
};
export default cartController;
//# sourceMappingURL=cart.controller.js.map