const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const voucherSchema = new Schema({
    id_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String },
    code: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true },
    start_day: { type: Date, required: true },
    end_day: { type: Date, required: true }
});

module.exports = mongoose.models.Voucher || mongoose.model("Voucher", voucherSchema);
