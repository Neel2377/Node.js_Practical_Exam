const express = require('express');
const router = express.Router();
const userCtl = require('../controllers/user.controller');

router.get('/login', userCtl.loginPage);
router.post('/login', userCtl.loginUser);
router.get('/signup', userCtl.signupPage);
router.post('/signup', userCtl.signupUser);

module.exports = router;
