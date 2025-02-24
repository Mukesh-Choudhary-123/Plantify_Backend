import mongoose from 'mongoose'

const connectDB = async()=>{
  try {
    await mongoose.connect(process.env.DB_URl)
    console.log("Database Connected Successfully :-)")
  } catch (error) {
    console.log(error.message)
  }
}
export default connectDB;

