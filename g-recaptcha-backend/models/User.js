const mongoose = require('mongoose');
const UserShema = new mongoose.Schema({

   firstName: String,
   lastName: String,
   email: String,
   password: String,
   status: String ,
   passwordExpiryDate : Date,
   failedLoginAttempts : Number,
   lockUntil : Date

})


const UserModel = mongoose.model('user', UserShema);
module.exports = UserModel  