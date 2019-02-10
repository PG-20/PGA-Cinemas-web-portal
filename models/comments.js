let db = require('mongoose');

//Set the Schema
var commentSchema = new db.Schema({
    commentID: Number,
    userID: String,
    filmID: Number,
    Comment: String
});

//Create my model

var Comment = db.model("comment", commentSchema, "comments");

module.exports = Comment;

