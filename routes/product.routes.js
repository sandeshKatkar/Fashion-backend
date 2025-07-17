import express from 'express'
import { addProduct,removeProduct,listProducts,singleProduct } from '../controllers/product.controller.js'
import uploade from '../middlewares/multer.middleware.js'
import adminAuth from '../middlewares/adminAuth.middleware.js'

const productRouter=express.Router()

productRouter.post('/add',adminAuth,uploade.fields([
    {name:'image1',maxCount:1},
    {name:'image2',maxCount:1},
    {name:'image3',maxCount:1},
    {name:'image4',maxCount:1},
]),addProduct)
productRouter.post('/remove',adminAuth,removeProduct)
productRouter.get('/list',listProducts)
productRouter.post('/single',singleProduct)

export default productRouter