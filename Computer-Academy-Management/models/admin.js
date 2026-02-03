const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const adminSchema = new Schema({
  username: {
    type: String,
    required: true, 
    unique: true 
    },
  password: { 
    type: String, 
    required: true
  },
  is_admin:{
  type:Boolean,
  required:true
  }
});

const Admin = mongoose.model("admin",adminSchema);
module.exports = Admin;

