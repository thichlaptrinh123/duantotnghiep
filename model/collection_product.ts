import mongoose from "mongoose";

const Collection_productSchema = new mongoose.Schema({
  id_product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  id_collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Collection_product || mongoose.model("Collection_product", Collection_productSchema);
