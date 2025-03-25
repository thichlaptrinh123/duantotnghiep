const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: { type: String, required: true },
    comments: { type: String },
    image: { type: String }
});

module.exports = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
