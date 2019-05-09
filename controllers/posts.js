const express = require('express');
const router = express.Router();

// Database
const db = require('../models');

// GET Post Show Route
router.get('/:postId', async (req, res) => {
try {
    const post = await db.Post.findById(req.params.postId)
    .populate('user_id', '-password -__v')
    .populate('city_id')
    .exec();

    res.json({post})
} catch (err) {
    console.log(err);
    return res.status(500).json({status: 500, error: 'Something went wrong. Please try again'});
}
});

// DELETE Post Destroy Route
router.delete('/:postId', async (req, res) => {
if (!req.session.currentUser) {
    return res.status(401).json({status: 401, error: 'Unauthorized. Please login and try again'});
}

try {
    const post = await db.Post.findById(req.params.postId);
    if (post.user_id.toString() === req.session.currentUser) {
    const deletedPost = await post.deleteOne();
    res.sendStatus(200);
    }
    res.status(401).json({status: 401, error: 'Unauthorized. Please log in and try again'});
} catch(err) {
    console.log(err);
    return res.status(500).json({status: 500, error: 'Something went wrong. Please try again'});
}
});

module.exports = router;
