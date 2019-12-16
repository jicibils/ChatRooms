var express = require('express');
var router = express.Router();
var _login = require('./login.js');

// Confirm User Login
router.post('/confirmUser', _login.confirmUser);

module.exports = router;
