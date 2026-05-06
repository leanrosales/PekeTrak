const express = require("express");
const router = express.Router();
const viajeController = require("../controllers/viajeController");
router.get("/actual", viajeController.obtenerViajeActual);

module.exports = router;
