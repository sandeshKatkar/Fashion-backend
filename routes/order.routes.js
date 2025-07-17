import express from 'express'
import { placeOrderCod,placeOrderStrip,allOrders,userOrders,updateOrderStatus, verifyStripe } from '../controllers/order.controller.js'
import adminAuth from '../middlewares/adminAuth.middleware.js'
import authUser from '../middlewares/userAuth.js'


const orderRouter=express.Router()

// Admin fetures
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateOrderStatus)

// Payment fetures
orderRouter.post('/place',authUser,placeOrderCod)
orderRouter.post('/stripe',authUser,placeOrderStrip)
// orderRouter.post('/razarpay',authUser,placeOrderRozarpay)

// User fetures
orderRouter.post('/userorder',authUser,userOrders)

// Verify payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)
// orderRouter.post('/verifyRazorpay',authUser,verifyRazorpay)

export default orderRouter