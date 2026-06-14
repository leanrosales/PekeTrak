const express = require("express");
const router = express.Router();
const viajeController = require("../controllers/viajeController");

router.get("/actual", viajeController.obtenerViajeActual);
router.post("/telemetria", viajeController.guardarTelemetria);

router.post("/login", viajeController.loginTutor);

// RUTAS RFID FALTANTES
router.post("/rfid/evento", viajeController.registrarEventoRFID);
router.get("/rfid/estado", viajeController.consultarUltimoEvento);

module.exports = router;
