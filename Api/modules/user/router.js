var express = require('express');
var router = express.Router();
var _user = require('./user.js');

// Save User
router.post('/saveUser', _user.saveUser);

// Change Password
router.post('/changePassword', _user.changePassword);

//Remove Account
router.post('/deleteAccount', _user.deleteAccount);

//Save Profile Picture
router.post('/saveProfilePicture', _user.saveProfilePicture);

//Add Account to the user
router.post('/addAccount', _user.addAccount);

//Add Account to the user
router.post('/removeAccount', _user.removeAccount);

//Fetch user from account
router.post('/fetchUserByAccount', _user.fetchUserByAccount);

//getUserByCuit
router.post('/getUserByCuit', _user.getUserByCuit);

module.exports = router;
