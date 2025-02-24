import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: [Schema.Types.Mixed], default: [] },
    username: { type: String, required: true },
    isApproved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
