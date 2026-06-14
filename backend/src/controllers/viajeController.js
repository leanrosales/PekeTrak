const db = require("../data/db"); // Apuntamos a tu base de datos SQLite

// ==========================================
// 1. FUNCIONES DE TELEMETRÍA Y ACCESO
// ==========================================

// GET: Obtener la última ubicación (Para el celular del padre)
const obtenerViajeActual = (req, res) => {
  const sql = `SELECT * FROM Registro_Telemetria ORDER BY id_registro DESC LIMIT 1`;

  db.get(sql, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.json({
        mensaje: "Aún no hay datos de telemetría registrados.",
      });
    }

    // Devolvemos los datos reales sacados de la BD
    res.json({
      ruta: "Ruta Centro - Zona Norte",
      bus: "BUS-001",
      estado_viaje: row,
    });
  });
};

// POST: Recibir nuevas coordenadas (Simula el Hardware IoT)
const guardarTelemetria = (req, res) => {
  const { id_vehiculo, latitud, longitud, velocidad_kmh } = req.body;

  const sql = `INSERT INTO Registro_Telemetria (id_vehiculo, latitud, longitud, velocidad_kmh) VALUES (?, ?, ?, ?)`;

  db.run(sql, [id_vehiculo, latitud, longitud, velocidad_kmh], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      mensaje: "Coordenada guardada con éxito en la BD",
      id_registro: this.lastID,
    });
  });
};

// POST: Autenticación del padre de familia
const loginTutor = (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM Tutor WHERE email = ? AND password = ?`;

  db.get(sql, [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    // Si no encuentra el usuario, devuelve un error 401 (No autorizado)
    if (!row)
      return res.status(401).json({ error: "Credenciales incorrectas" });

    // Si lo encuentra, da luz verde
    res.json({ mensaje: "Login exitoso", tutor: row.nombre });
  });
};

// ==========================================
// 2. FUNCIONES DE LA MANILLA RFID (MÁQUINA DE ESTADOS)
// ==========================================

// Variable temporal en memoria para el simulador
// Variable que ahora guarda un objeto con un ID único
let ultimoEventoRFID = { tipo: null, id: 0 };

const registrarEventoRFID = async (req, res) => {
  try {
    const { id_rfid_uid, id_vehiculo, tipo_evento } = req.body;

    // Le asignamos el tiempo exacto (Date.now) para que el frontend sepa que es un evento NUEVO
    ultimoEventoRFID = { tipo: tipo_evento, id: Date.now() };

    console.log(
      `👉 Backend procesó RFID: ${id_rfid_uid} | Evento: ${tipo_evento}`,
    );

    return res.status(200).json({ success: true, message: "Procesado" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const consultarUltimoEvento = (req, res) => {
  // Ya NO lo borramos. Lo mandamos así como está. El frontend será inteligente y sabrá si ya lo leyó.
  res.json(ultimoEventoRFID);
};

// ==========================================
// 3. EXPORTACIÓN MAESTRA
// ==========================================
// Aquí es donde Express agarra absolutamente TODAS las funciones
module.exports = {
  obtenerViajeActual,
  guardarTelemetria,
  loginTutor,
  registrarEventoRFID,
  consultarUltimoEvento,
};
