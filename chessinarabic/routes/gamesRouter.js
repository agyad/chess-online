const express = require('express');
const gamesControllers = require('./../controllers/gamesControllers');
const router = express.Router();
router.route('/:id').get(gamesControllers.game);
module.exports = router;
