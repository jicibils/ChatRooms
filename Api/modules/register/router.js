var express = require('express');
var router = express.Router();
var _register = require('./register.js');

// Register User
router.post('/registerUser', _register.registerUser);

module.exports = router;
