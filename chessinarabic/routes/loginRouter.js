const express = require('express');
const loginControllers = require('./../controllers/loginControllers');
const router = express.Router();
router.route('/').get(loginControllers.loginPage).post(loginControllers.loging);
module.exports = router;
