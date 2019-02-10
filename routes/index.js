var express = require('express');
var router = express.Router();
var path    = require("path");

// /* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/index.html');
});

router.get('/index.html', function(req, res, next) {
    res.render('index');
});

router.get('/createaccount.html', function(req, res, next) {
    res.render('createaccount');
});

router.get('/main.html', function(req, res, next) {
    if (req.session.user) {
        res.render('main');
    }else{
        res.render('error',{errorMsg: "User not logged in: Redirecting to Login", redirect: '/'})
    }
});

module.exports = router;
