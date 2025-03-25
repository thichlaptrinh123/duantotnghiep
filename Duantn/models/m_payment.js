const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    id_order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    name: { type: String, required: true }
});

module.exports = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
