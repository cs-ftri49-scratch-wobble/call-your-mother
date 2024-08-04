const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  hobbies: [{ type: String }], //array to easily push more. user.hobbies.push(hobby)
});

module.exports = mongoose.model('User', userSchema);
