const express = require('express');
const router = express.Router();
const openingControllers = require('./../controllers/openingsControllers');
router.route('/').get(openingControllers.getopeningsPage);
router.route('/data').get(openingControllers.getresult);

module.exports = router;
