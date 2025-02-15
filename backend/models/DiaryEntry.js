const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiaryEntrySchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entry_date: { type: Date, required: true },
  product_name: { type: String, required: true },
  grams: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DiaryEntry', DiaryEntrySchema);