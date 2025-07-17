import userModel from "../models/user.model.js"


//---------add product to cart-----------
const addToCart=async(req,res)=>{

try {
        const {userId,itemId,size}=req.body
    
        const userData=await userModel.findById(userId)
        let cartData=await userData.cartData;
    
        if (cartData[itemId]) {
    
            if (cartData[itemId][size]) {
                cartData[itemId][size]+=1;
            } else {
                cartData[itemId][size]=1;
            }
            
        } else {
            cartData[itemId]={}
            cartData[itemId][size]=1
        }

        await userModel.findOneAndUpdate({ _id: userId },{cartData})

        res.json({success:true,message:"Added to cart"})
    
} catch (error) {
    console.log(error.message)
    res.json({success:false,message:error.message})
}
}

//---------update user cart-----------
const updateCart=async(req,res)=>{

    try {
         const {userId,itemId,size,quantity}=req.body
    
        const userData=await userModel.findById(userId)
        let cartData=await userData.cartData;

        cartData[itemId][size]=quantity
        
        await userModel.findOneAndUpdate({_id:userId},{cartData})

        res.json({success:true,message:"Cart is updated"})
    
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})    
    }


}

//---get user cart Data-----
const getUserCart=async(req,res)=>{

    try {
         const {userId}=req.body
    
        const userData=await userModel.findById(userId)
        let cartData=await userData.cartData;

        res.json({success:true,cartData:userData.cartData})
    
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}

export {addToCart,getUserCart,updateCart}
