var express = require('express');
var router = express.Router();
var Film = require('../models/film');
var Comment = require('../models/comments')

router.get('/comment', async function(req,res){
    let films = await Film.find();
    res.render('comments', {films: films})
});

router.post('/comment_submit', async function(req,res){
    if (req.session.user) {
        let last = await Comment.find().sort({commentID: -1}).limit(1)
        var comment = new Comment({
            commentID: last[0].commentID + 1,
            userID: req.session.user,
            filmID: req.body.filmSelect,
            Comment: req.body.comment,
        });

        Comment.create(comment, function (err, result) {
            if (err === null) {
                res.render('error', {errorMsg: "Comment Submitted", redirect: '/comments/comment'})
            } else {
                res.send(err)
            }
        });
    }else{
        res.render('error', {errorMsg: "Not logged in", redirect: "/"})
    }
});

router.get('/comment_retrieve/:filmID', async function(req,res){
    let comments = await Comment.find({filmID: req.params.filmID});
    res.set('Content-Type','text/html');
    res.render('comment_retrieve', {comments: comments});
});

module.exports = router;