import mongoose from "mongoose";

const connectDB = async () => {
  console.log("Connecting to MongoDB with URI:", process.env.MONGODB_URI);

  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log("❌ Error connecting to MongoDB:", error);
  }
};

export default connectDB;




// import mongoose from "mongoose";

// const connectDB=async()=>{


// console.log("Connecting to MongoDB with URI:", process.env.MONGODB_URI);

// mongoose.connection.on("connected", () => {
//     console.log("✅ MongoDB connected successfully");
//   });

//   mongoose.connection.on("error", (err) => {
//     console.error("❌ MongoDB connection error:", err);
//   });


//    try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce-mern`);
//    } catch (error) {
//     console.log(error)
//    }
// }

// export default connectDB;