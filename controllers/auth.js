const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Database
const db = require('../models');

// POST Register Route
router.post('/register', async (req, res) => {
const errors = [];

// Validation
if (!req.body.name) errors.push({message: 'Please enter your name'});
if (!req.body.email) errors.push({message: 'Please enter your email'});
if (!req.body.password) errors.push({message: 'Please enter your password'});
if (req.body.password !== req.body.password2) errors.push({message: 'Your passwords do not match'});

// If errors, respond with errors array
if (errors.length) return res.status(400).json({status: 400, errors});


try {
    // Check for existing user account
    const userExists = await db.User.findOne({email: req.body.email});
    if (userExists) return res.status(400).json({status: 400, errors: [{message: 'Email address has already been registered'}]});

    // Hash user password from register form
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // Create new user object
    const newUser = {};
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.city = req.body.city;
    newUser.password = hashedPassword;

    // Save New User
    const savedUser = await db.User.create(newUser);
    res.sendStatus(200);

} catch (err) {
    console.log(err);
    return res.status(500).json({status: 500, error: err});
}

});


// POST Login Route
router.post('/login', async (req, res) => {
if (!req.body.email || !req.body.password) return res.status(400).json({status: 400, error: 'Please enter your email and password'});

try {
    // Find User by email
    const foundUser = await db.User.findOne({email: req.body.email});

    // If no user found, return error
    if (!foundUser) return res.status(400).json({status: 400, error: 'Email or password is incorrect'});

    // Compare Passwords
    const passwordsMatch = bcrypt.compareSync(req.body.password, foundUser.password);

    // Return error if password do not match
    if (!passwordsMatch) return res.status(400).json({status: 400, error: 'Email or password is incorrect'});

    // Create user session
    req.session.currentUser = foundUser._id;

    res.status(200).json({status: 200, currentUser: foundUser._id});

} catch(err) {
    console.log(err);
    
    return res.status(500).json({status: 500, error: 'Something went wrong. Please try again'});
}

});


// POST Logout Route
router.post('/logout', (req, res) => {
// Delete the user session
req.session.destroy(err => {
    if (err) return res.status(500).json({status: 500, errors: 'Something went wrong. Please try again'});
    // Remove the cookie from the response object header
    res.clearCookie('connect.sid').json({status: 200, message: 'Logout successful'});
});
});



module.exports = router;
