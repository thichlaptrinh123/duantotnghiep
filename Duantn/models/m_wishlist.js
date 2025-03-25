const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    id_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id_product: { type: Schema.Types.ObjectId, ref: "Product", required: true }
});

module.exports = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
