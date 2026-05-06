const express = require("express");
const cors = require("cors");

const viajesRutas = require("./src/routes/viajeRutas");

const app = express();
const PUERTO = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/viajes", viajesRutas);

app.listen(PUERTO, () => {
  console.log(`Servidor de Peke Trak corriendo al 100% en el puerto ${PUERTO}`);
});
