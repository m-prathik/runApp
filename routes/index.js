var express = require('express');
var prettier = require('prettier');

const userTable = require('../db/model/userModel.js');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/allUsers',async function(req, res, next){
    const result = await userTable.find();
    res.send(JSON.stringify(result, null));
})

module.exports = router;
