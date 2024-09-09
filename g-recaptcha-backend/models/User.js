const mongoose = require('mongoose');
const UserShema = new mongoose.Schema({

   firstName: String,
   lastName: String,
   email: String,
   password: String,
   status: String ,
   passwordExpiryDate : Date,
   failedLoginAttempts : Number,
   lockUntil : Date,
   passwordHistory: {
      type: [String],  // Array to store hashed passwords
      default: []
    },// Array of previous passwords


})


const UserModel = mongoose.model('user', UserShema);
module.exports = UserModel  