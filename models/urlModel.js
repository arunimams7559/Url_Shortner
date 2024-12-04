

const mongoose = require('mongoose');
const shortid = require('shortid');

const urlSchema = new mongoose.Schema({
    title: String,
    url: String,
    shortUrl: { type: String, default: shortid.generate }, // Automatically generate short URL
    username: String,
    createdAt: { type: Date, default: Date.now }  // Automatically sets the date

});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
