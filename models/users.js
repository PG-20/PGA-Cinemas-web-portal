db = require('mongoose');


//Set the Schema
var userSchema = new db.Schema({
    username: String,
    password: String,
});

//Create my model
var User = db.model("user", userSchema, "users");


module.exports = User;


