const viajeData = require("../data/viajeData");
const obtenerViajeActual = (req, res) => {
  res.json(viajeData);
};
module.exports = { obtenerViajeActual };
