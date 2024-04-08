const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    title: String,
    slug: String,
    content: String,
    image: String,
});

module.exports = mongoose.model('Page', pageSchema);
