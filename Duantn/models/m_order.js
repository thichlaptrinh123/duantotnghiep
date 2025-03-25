const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    id_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id_voucher: { type: Schema.Types.ObjectId, ref: "Voucher", default: null },
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
    shipping_fee: { type: Number, default: 0 }
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
