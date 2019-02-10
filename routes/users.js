var express = require('express');
var router = express.Router();
var User = require('../models/users');
var path = require("path");

/* GET users listing. */
router.post('/verifyLogin', function(req, res) {
    if (req.session.user){
        res.redirect('/main.html')
    }

    User.findOne({username: req.body.username},
        function (err, user){
            if (err == null) {
                var dbEntry = user;

                if (dbEntry && req.body.password == dbEntry.password) {
                    req.session.user = req.body.username;
                    req.session.save();
                    res.redirect('/main.html');
                } else {
                    res.send('Invalid Login')
                }
            }else{
                res.render('error',{errorMsg: err, redirect: '/'})
            }
    });
});

router.post('/create', async function(req, res) {

    var userID = req.body.username;
    var checkDuplicate = await User.find({username: userID});
    if (checkDuplicate.length === 0) {
        var addUser = new User({
            username: req.body.username,
            password: req.body.password
        });

        addUser.save(function (err, result) {
            res.render('error' ,{errorMsg: 'Account created', redirect: '/'});
        });
    }else{
        res.render('error', {errorMsg: "User already exists, try again", redirect: '/createaccount.html'})
    }
});

router.get('/logout', function(req,res){
    if (req.session.user){
        req.session.destroy(function(){
            res.redirect('/index.html')});
    }
    else{
        res.redirect('/index.html')
    }
});

module.exports = router;
