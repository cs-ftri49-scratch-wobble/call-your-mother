const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  usedId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    expires: 30,
    default: Date.now
  }
})

module.exports = mongoose.model('Session', SessionSchema);