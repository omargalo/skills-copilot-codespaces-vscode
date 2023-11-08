// Create web server
// Create a new comment
// Update a comment
// Delete a comment
// Get a comment
// Get all comments
// Get all comments for a blog post

// Dependencies
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Blog = require('../models/blog');

// Create a new comment
router.post('/blogs/:id/comments', (req, res) => {
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    comment
        .save()
        .then(comment => {
            return Promise.all([Blog.findById(req.params.id)]);
        })
        .then(([blog, user]) => {
            blog.comments.unshift(comment);
            return Promise.all([blog.save()]);
        })
        .then(blog => {
            res.redirect(`/blogs/${req.params.id}`);
        })
        .catch(err => {
            console.log(err);
        });
});

// Update a comment
router.put('/blogs/:id/comments/:comment_id', (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment).then(
        comment => {
            res.redirect(`/blogs/${req.params.id}`);
        }
    );
});

// Delete a comment
router.delete('/blogs/:id/comments/:comment_id', (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id).then(comment => {
        res.redirect(`/blogs/${req.params.id}`);
    });
});

module.exports = router;
