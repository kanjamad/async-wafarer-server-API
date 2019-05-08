const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

 // Database
const db = require('../models');

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
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = hashedPassword;

    // Save New User
    const savedUser = await db.User.create(newUser);
    res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.status(500).json({status: 500, error: err});
    }

});

module.exports = router;