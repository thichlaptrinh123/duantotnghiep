import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  id_product: {type: mongoose.Schema.Types.ObjectId,ref: "Product",required: true,},
  id_user: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true},
  content: {type: String},
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
