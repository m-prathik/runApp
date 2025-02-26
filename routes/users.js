var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { userExistInDb } = require('../db/model/userModel.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/addUser', async function(req, res, next) {
  var value = req.body.userName;
  if(await userExistInDb(value)){
    res.send("alreadyExists");
  }
  else {
    res.send("doesn't exist")
  }
});

module.exports = router;
