const express = require('express');
const router = express.Router();

const { signup, signin, requireSignin, auth } = require('../controllers/user');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/auth', requireSignin, auth);

module.exports = router;
