import mongoose from "mongoose";

const couponCodeSchema = new mongoose.Schema({
    name: {
      en: String,
      de: String
    },
    description: {
      en: String,
      de: String
    },
    cartDiscounts: [
      {
        typeId: String,
        id: String
      }
    ],
    cartPredicate: String,
    isActive: Boolean,
    maxApplications: Number,
    maxApplicationsPerCustomer: Number,
    code : String,
    qrcode : String
  },
  { timestamps: true }
  );
  
export default mongoose.model("Coupon", couponCodeSchema);