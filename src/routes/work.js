const express = require('express');
const router = express.Router();

const {
  requireSignin,
  userById,
  isAdmin,
  isAuth,
} = require('../controllers/user');

const { f1, f2, f3, f4 } = require('../controllers/work');

router.get('/f1', f1);
router.get('/f2', requireSignin, f2);
router.get('/f3', requireSignin, isAdmin(3), f3);
router.get('/f4/:userId', requireSignin, isAuth, f4);

router.param('userId', userById);

module.exports = router;
