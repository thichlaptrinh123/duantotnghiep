const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const productVariantSchema = new Schema({
    id_product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    stock_quantity: { type: Number, required: true }
});

module.exports = mongoose.models.ProductVariant || mongoose.model("ProductVariant", productVariantSchema);
