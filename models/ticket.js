let db = require('mongoose');


//Set the Schema
var ticketSchema = new db.Schema({
    ticketID: Number,
    seatNo: String,
    broadcastID: Number,
    userID: String,
    ticketType:String,
    ticketFee: Number
});

//Create my model

var Ticket = db.model("ticket", ticketSchema, "tickets");

module.exports = Ticket;