db = require('mongoose');

//Set the Schema
var filmSchema = new db.Schema({
    filmID: Number,
    filmName: String,
    duration: Number,
    category: String,
    language: String,
    director: String,
    description: String,
    filmIMG: String
});

//Create my model
var Film = db.model("film", filmSchema, "films");


module.exports = Film;
