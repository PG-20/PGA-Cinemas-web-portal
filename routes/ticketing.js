var express = require('express');
var router = express.Router();
var Film = require('../models/film');
var Broadcast = require('../models/broadcast');
var House = require('../models/house');
var Ticket = require('../models/ticket')


router.get('/buywelcome', function (req, res) {
    Film.aggregate([
            {
                $lookup:
                    {
                        from: "broadcasts",
                        localField: "filmID",
                        foreignField: "filmID",
                        as: "broadcastOptions"
                    }
            },
        ],
        function (err, data) {
            res.render('buywelcome', {movies: data});
        }
    );
});

router.get('/seatplantry?:broadcastID', async function(req,res){
    if (req.session.user) {
        let a = parseInt(req.query.broadcastID);
        let broadcast = await Broadcast.findOne({broadcastID: a});

        let film = await Film.findOne({filmID: broadcast.filmID});
        let house = await House.findOne({houseID: broadcast.houseID});
        let tickets = await Ticket.find({broadcastID: a});
        var soldSeats = [];
        tickets.forEach((obj, index) => {
            soldSeats[index] = obj.seatNo
        });

        res.render('seatplantry', {house: house, broadcast: broadcast, film: film, soldSeats: soldSeats});
    }else{
        res.render('error', {errorMsg: "Not logged in", redirect: "/"})
    }
});

router.post('/buyticket', async function(req,res){
    if (req.session.user) {
        let a = req.body.broadcast;
        let broadcast = await Broadcast.findOne({broadcastID: a});
        let film = await Film.findOne({filmID: broadcast.filmID});
        let selectedSeats = Array.isArray(req.body["seats[]"]) ? req.body["seats[]"] : [req.body["seats[]"]];

        res.render('buyticket', {broadcast: broadcast, film: film, selectedSeats: selectedSeats});
    }else{
        res.render('error', {errorMsg: "Not logged in", redirect: "/"})
    }
});

router.post('/confirm',async function(req,res){
    if (req.session.user) {
        let a = req.body.broadcast;
        let broadcast = await Broadcast.findOne({broadcastID: a});
        let film = await Film.findOne({filmID: broadcast.filmID});
        let selectedSeats = Array.isArray(req.body["selectedSeats[]"]) ? req.body["selectedSeats[]"] : [req.body["selectedSeats[]"]];
        let selectTicketCategory = Array.isArray(req.body["selectTicketCategory[]"]) ? req.body["selectTicketCategory[]"] : [req.body["selectTicketCategory[]"]];

        selectedSeats.forEach(async function (seat, index) {
            let duplicateCheck = await Ticket.find({seatNo: seat, broadcastID: a,});

            if (duplicateCheck.length === 0) {
                let last = await Ticket.find().sort({ticketID: -1}).limit(1);

                var ticket = new Ticket({
                    ticketID: last[0].ticketID + 1,
                    seatNo: seat,
                    broadcastID: a,
                    userID: req.session.user,
                    ticketType: selectTicketCategory[index],
                    ticketFee: selectTicketCategory[index] == "Adult" ? 75 : 50,
                });
                Ticket.create(ticket, function (err, result) {
                    if (err === null) {
                        res.render('confirm', {
                            broadcast: broadcast,
                            film: film,
                            selectedSeats: selectedSeats,
                            selectTicketCategory: selectTicketCategory
                        });
                    } else {
                        res.render('error', {errorMsg: "Couldn't book ticket", redirect: "/ticketing/buywelcome"})
                    }
                })
            } else {
                res.render('error', {errorMsg: "Duplicate", redirect: "/ticketing/buywelcome"})
            }
        })
    }else{
        res.render('error', {errorMsg: "Not logged in", redirect: "/"})
    }
});

router.get('/history', function(req,res){
    if (req.session.user) {
        Ticket.aggregate([{
                    $match: {userID: req.session.user,}
                },
                {
                    $lookup:
                        {
                            from: "broadcasts",
                            localField: "broadcastID",
                            foreignField: "broadcastID",
                            as: "broadcastInfo"
                        }
                },
                {$unwind: "$broadcastInfo"},
                {
                    $lookup:
                        {
                            from: "films",
                            localField: "broadcastInfo.filmID",
                            foreignField: "filmID",
                            as: "filmInfo"
                        }
                }, {
                    $unwind: "$filmInfo"}],
            function (err, data) {
                if (err === null) {
                    res.render('history', {purchases: data, userName: req.session.user})
                } else {
                    res.render('error', {errorMsg: err, redirect: '/main.html'})
                }
            }
        )
    }else{
        res.render('error', {errorMsg: "Not logged in", redirect: "/"})
    }
});

module.exports = router;