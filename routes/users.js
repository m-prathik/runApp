var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {userTable, userExistInDb} = require('../db/model/userModel.js');
router.use(express.json());
/* GET users listing. */

// api to add user 
router.post('/addUser', async function(req, res, next) {
  console.log("/addUser api called");
  console.log(req.body);
  var value = req.body;
  try {
    const newUser = new userTable(value);
    console.log("new user created from model");
    await newUser.validate();
    await newUser.save();
    res.status(200).json({message :"Successfully added user !!"});
  } catch(err) {
    res.status(400).json({error: err.message});
  }
});

// api to login

router.post('/login', async function(req, res) {
  console.log("login request received");
  const reqBody = req.body;
  try {
    const userName = req.body.userName;
    const passWord = req.body.password;
    var result = await validateLoginDetails({userName, passWord});
    if(result == true) {
      res.status(200).json({message: "UserSuccessfully logged in"});
    } else {
      res.status(400).json({error: "authentication failed"});
    }
  } catch(err) {
    res.status(400).json({error: err.message});
  }
})

async function validateLoginDetails({userName, passWord}) {
  console.log('inside validate login details');

  if(typeof userName !== 'string' || userName === null) {
      return false;
  }
  if(typeof passWord !== 'string' || passWord === null) {
    return false;
  }
  var store = await userExistInDb(userName);
  console.log(store);
  if(store == false) {
    return false;
  }
  if(store.userName === userName && store.password === passWord) {
    return true;
  }
  return false;

}

module.exports = router;
