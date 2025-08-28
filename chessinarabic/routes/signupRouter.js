const express = require('express');
const router = express.Router();
const signupControllers = require('./../controllers/signupControllers');
router
  .route('/')
  .get(signupControllers.signupPage)
  .post(signupControllers.signingup);
module.exports = router;
