var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    "id":Number,
    "name": {type:String, required:true},
    "password": {type:String, required:true},
    "role": {type:String, required:true},
    "userName":{type:String, required:true,unique:true}
  });

const userTable = mongoose.model('app_user_infos', userSchema);


async function userExistInDb(name) {
  var GET_USER_FROM_NAME = {userName : `${name}`};
  var value = await userTable.find(GET_USER_FROM_NAME);
  if(value.length == 0) return false;
  return true;
}

module.exports = {userTable, userExistInDb};
