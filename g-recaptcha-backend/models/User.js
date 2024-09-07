const mongoose = require('mongoose');
const UserShema = new mongoose.Schema({
   userId: String,
   firstName: String,
   lastName: String,
   email: String,
   password: String,
   status: String 

})


const UserModel = mongoose.model('user', UserShema);
module.exports = UserModel  