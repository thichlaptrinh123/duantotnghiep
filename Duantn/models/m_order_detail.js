const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema({
    id_order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    id_product_variant: { type: Schema.Types.ObjectId, ref: "ProductVariant", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.models.OrderDetail || mongoose.model("OrderDetail", orderDetailSchema);
