var mongoose = require('mongoose');
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
const userSchema = new mongoose.Schema({
    "id":{
      type: Number,
      required : false,
    },
    "name": {
      type:String,
      required:[true, "Name is required"],
      minlength:[5, 'Name must be atleast 5 characters long']
    },
    "password": {
      type:String,
      required:[true,"password is a mandatory field"],
      validate:{
        validator:function(v) {
          return passwordRegex.test(v);
        },
        message:'Invalid password password must contain one capital letter one small letter and min 8 characters',
      },
    },
    "role": {
      type:String,
      required:[true, 'Role is a mandatory field'],
    },
    "userName":{
      type:String,
      required:[true,"userName is a mandatory field"],
      unique:true
    },
  },
  {versionKey : false}
);

// the arguments are [collection_name_in_mongo_db, schema for the collection]
const userTable = mongoose.model('app_user_infos', userSchema);


async function userExistInDb(name) {
  var GET_USER_FROM_NAME = {userName : `${name}`};
  var value = await userTable.findOne(GET_USER_FROM_NAME).then(user => {
    const result = {
      userName : user.userName,
      password : user.password
    }
    return result;
  });
  
  if(value === null) return false;
  return value;
}

module.exports = {userTable, userExistInDb};
