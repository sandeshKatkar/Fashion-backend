import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/product.model.js'


// add product
const addProduct=async(req,res)=>{
    try {
        const {name,description,price,category,subCategory,sizes,bestseller,date}=req.body
        

        // // getting images
        // const image1=req.files.image1 && req.files.image1[0] 
        // const image2=req.files.image2 && req.files.image2[0] 
        // const image3=req.files.image3 && req.files.image3[0] 
        // const image4=req.files.image4 && req.files.image4[0]
        
        
    // getting images safely
    const image1 = req.files.image1?.[0];
    const image2 = req.files.image2?.[0];
    const image3 = req.files.image3?.[0];
    const image4 = req.files.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);
        // const images=[image1,image2,image3,image4]

        // Uploding data to cloudinary
        let imageUrl=await Promise.all(
            images.map(async(item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        // Saving Data to 
        
        const productData={
            name,
            description,
            price:Number(price),   // for testing purpose
            category,
            subCategory,
            sizes:JSON.parse(sizes),  // it convert string data to array (for testing purpose)
            bestseller:bestseller==='true'?true:false,  // for testing purpose
            date:Date.now(),
            image:imageUrl
        }

        console.log(productData)

        const product=new productModel(productData)
        await product.save()

        res.json({
            success:true,
            message:"Product added successfully !"
        })


        // console.log(name,description,price,category,subCategory,sizes,bestseller,date)
        // console.log(imageUrl)
        res.json({msg:"success"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// list product
const listProducts=async(req,res)=>{

   try {
     const products=await productModel.find()
     res.json({
         success:"true",
         products
     })
   } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
   }

}

// remove product
const removeProduct=async(req,res)=>{

    try {
     const products=await productModel.findByIdAndDelete(req.body.id)
     res.json({
         success:"true",
         message:"Product removed successfully"
     })
   } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
   }

}

// single product info
const singleProduct=async(req,res)=>{

    try {
        const {productId}=req.body
        const product=await productModel.findById(productId)
        res.json({
            success:"true",
            product
        })
   } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
   }



}

export {addProduct,listProducts,removeProduct,singleProduct}
