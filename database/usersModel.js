// import modules
const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  created_at: {
    type: Date,
  },
  updated_at: {
    type: Date,
  },
});

const Users = mongoose.model("users", usersSchema);

module.exports = Users;
