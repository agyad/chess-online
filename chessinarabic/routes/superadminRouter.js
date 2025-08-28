const express = require('express');
const superadminControllers = require('../controllers/superadminControllers');
const router = express.Router();
router
  .route('/')
  .get(superadminControllers.superadminpage)
  .post(superadminControllers.createUser);
router
  .route('/login')
  .get(superadminControllers.loginpage)
  .post(superadminControllers.loging);
router
  .route('/:id')
  .get(superadminControllers.readUser)
  .delete(superadminControllers.removeUser);
module.exports = router;
