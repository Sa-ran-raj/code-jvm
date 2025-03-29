const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String }
});

const Scheme = mongoose.model('Scheme', schemeSchema);
module.exports = Scheme;
