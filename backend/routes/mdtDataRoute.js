const express = require("express");
const router = express.Router();
const {
  getData,
  setData,
 } = require('../controllers/mdtDataController');

router.get('/',getData)
router.post('/',setData)

module.exports = router;
