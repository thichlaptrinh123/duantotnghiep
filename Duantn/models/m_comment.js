const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    id_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id_product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
