require('dotenv').config();
var mongoose = require('mongoose');


const MONGOURL = process.env.MONGO_URL;

function connectToDB() {
    mongoose.connect(MONGOURL)
        .then(()=> console.log("database connected successfully\n\n"))
        .catch((error)=> handleError(error))
};


function handleError(error) {
    console.log(error);
}

module.exports = {connectToDB};
