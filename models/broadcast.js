db = require('mongoose');

//Set the Schema
var broadcastSchema = new db.Schema({
    broadcastID: Number,
    dates: Date,
    filmID: Number,
    houseID: String
});

//Create my model
var Broadcast = db.model("broadcast", broadcastSchema, "broadcasts");


module.exports = Broadcast;