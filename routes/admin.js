const { Router } = require('express');
const {
  getAllUsers,
  getAllHouses,
  getAllEscrows,
  getReports,
} = require('../controllers/adminController.js');

const router = Router();

router.get('/users', getAllUsers);
router.get('/houses', getAllHouses);
router.get('/escrow', getAllEscrows);
router.get('/reports', getReports);

module.exports = router;
