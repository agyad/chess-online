const express = require('express');
const playControllers = require('./../controllers/playConterollers');
const router = express.Router();
router.route('/').get(playControllers.GetBoard);
module.exports = router;
