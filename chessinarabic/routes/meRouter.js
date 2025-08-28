const express = require('express');
const meControllers = require('./../controllers/meControllers');
const router = express.Router();
router.route('/').get(meControllers.getpage);
router.route('/data').get(meControllers.getdata);
module.exports = router;
