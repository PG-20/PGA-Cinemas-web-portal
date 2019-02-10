db = require('mongoose');

//Set the Schema
var houseSchema = new db.Schema({
    houseID: String,
    houseRow: Number,
    houseCol: Number
});

//Create my model
var House = db.model("house", houseSchema, "houses");


module.exports = House;

