import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import Stripe from "stripe";
// import razorpay from "razorpay";


// global variables
const currency='INR' // you set the currency according to your country in which your stripe account is created
const deliveryCharge=10

// Stripe Gateway initialise
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// // Razorpay Gateway initialise
// const razorPayInstance=new razorpay({
//     key_id:process.env.RAZORPAY_KEY_ID,
//     key_secret:process.env.RAZORPAY_SECRET_KEY
// })


//  Placing order for COD method
const placeOrderCod = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: new Date(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    // after saving data to DB, clear the cart data
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//  Placing order for Strip method
const placeOrderStrip = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: new Date(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // creating line item for Stripe 

    const line_items=items.map((item)=>({
        price_data:{
            currency:currency,
            product_data:{
                name:item.name
            },
            unit_amount:item.price*100
        },
        quantity:item.quantity
    }))

    line_items.push({
         price_data:{
            currency:currency,
            product_data:{
                name:"Delivery Charges"
            },
            unit_amount:deliveryCharge*100
        },
        quantity:1
    })

    const session=await stripe.checkout.sessions.create({
        success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
        line_items,
        mode:'payment',
    })

        res.json({success:true,session_url:session.url})
  } catch (error) {
    res.json({success: false, message: error.message,});
  }
};

// // verify Stripe

const verifyStripe=async(req,res)=>{
    const {orderId,success,userId}=req.body
    try {
        if(success==='true'){
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true})
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        res.json({
      success: false,
      message: error.message,
    });
    }
}



// //  Placing order for RozarPay method
// const placeOrderRozarpay = async (req, res) => {

//     try {
//     const { userId, items, amount, address } = req.body;
//     const orderData = {
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "Razorpay",
//       payment: false,
//       date: new Date(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     const options={
//         amount:amount*100,
//         currency:currency.toUpperCase(),
//         receipt:newOrder._id.toString()
//     }

//     await razorPayInstance.orders.create(options,(error,order)=>{
//         if(error){
//             console.log(error)
//             return res.json({success:false,message:error.message})
//         }
//         res.json({success:true,order})
//     })

   
//   } catch (error) {
//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }

// };

// // verifying Razorpay payment

// const verifyRazorpay=async()=>{
//     try {
//         const {userId,razorpay_order_id}=req.body

//         const orderInfo=await razorPayInstance.orders.fetch(razorpay_order_id)
//         if (orderInfo.status==='paid') {
//             await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
//             await userModel.findByIdAndUpdate(userId,{cartData:{}})
//                 res.json({
//                     success: true,
//                     message: "Payment Successfull",
//                 });
//         } else {
//             res.json({
//                     success: false,
//                     message: "Payment Failed",
//                 });
//         }
        
//     } catch (error) {
//             res.json({
//       success: false,
//       message: error.message,
//     });
//     }
// }




//  All orders data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//  User order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
//  update order status from admin panel
const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  res.json({ orderId, status });
  try {
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
    verifyStripe,
    // verifyRazorpay,
  placeOrderCod,
  placeOrderStrip,
  // placeOrderRozarpay,
  allOrders,
  userOrders,
  updateOrderStatus,
};
