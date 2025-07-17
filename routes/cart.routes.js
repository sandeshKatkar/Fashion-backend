import express from 'express'
import { getUserCart,updateCart,addToCart } from '../controllers/cart.controller.js'
import authUser from '../middlewares/userAuth.js'

const cartRouter=express.Router()

cartRouter.post('/get',authUser,getUserCart)
cartRouter.post('/add',authUser,addToCart)
cartRouter.post('/update',authUser,updateCart)

export default cartRouter