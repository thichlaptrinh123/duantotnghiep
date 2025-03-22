const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {type: String, require: true},
    products : {type: Object, default: {}}
});


module.exports - mongoose.model.categories || mongoose.model ('categories', categorySchema);
