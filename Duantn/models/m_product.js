const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    id_category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    image: { type: String },
    product_hot: { type: Number, default: false },
    product_new: { type: Number, default: false },
    sale: { type: Number, default: 0 },
    status: { type: String, enum: ["available", "out_of_stock"], default: "available" },
    description: { type: String },
    price: { type: Number, required: true }
});


module.exports = mongoose.model.products || mongoose.model ('products', productSchema);
