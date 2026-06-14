const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./peketrak.db", (err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite (peketrak.db) 🚀");

    // Tabla 1: Telemetría
    db.run(`CREATE TABLE IF NOT EXISTS Registro_Telemetria (
      id_registro INTEGER PRIMARY KEY AUTOINCREMENT,
      id_vehiculo INTEGER,
      latitud REAL,
      longitud REAL,
      velocidad_kmh REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla 2: Tutores (Para el Login real)
    db.run(
      `CREATE TABLE IF NOT EXISTS Tutor (
      id_tutor INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      nombre TEXT
    )`,
      () => {
        // Creamos tu usuario de prueba automáticamente (si no existe)
        db.run(`INSERT OR IGNORE INTO Tutor (id_tutor, email, password, nombre) 
              VALUES (1, 'matias.padre@lasalle.edu', '123456', 'Padre de Matías')`);
      },
    );
  }
});

module.exports = db;
