const URL_TELEMETRIA = "http://localhost:3000/api/viajes/telemetria";
const URL_RFID = "http://localhost:3000/api/viajes/rfid/evento";

// =========================================================
// RUTA DE IDA: Domicilio (Av. Villarroel Esq. Beni) -> Colegio La Salle
// =========================================================
const rutaIda = [
  { lat: -17.3705, lng: -66.153, vel: 0 },
  { lat: -17.3735, lng: -66.1545, vel: 25 },
  { lat: -17.3775, lng: -66.1565, vel: 35 },
  { lat: -17.382, lng: -66.1585, vel: 40 },
  { lat: -17.386, lng: -66.16, vel: 20 },
  { lat: -17.3893424, lng: -66.160814, vel: 0 },
];

// =========================================================
// RUTA DE VUELTA: Colegio La Salle -> Domicilio (Av. Villarroel Esq. Beni)
// =========================================================
const rutaVuelta = [
  { lat: -17.3893424, lng: -66.160814, vel: 0 },
  { lat: -17.386, lng: -66.16, vel: 20 },
  { lat: -17.382, lng: -66.1585, vel: 40 },
  { lat: -17.3775, lng: -66.1565, vel: 35 },
  { lat: -17.3735, lng: -66.1545, vel: 25 },
  { lat: -17.3705, lng: -66.153, vel: 0 },
];

// =========================================================
// TIEMPOS DE ESPERA (ms) - Ajustados para una demo pausada
// =========================================================
const ESPERA_EVENTO = 3000; // tiempo tras un evento RFID (abordaje, llegada, etc.)
const ESPERA_GPS = 2000; // tiempo entre cada punto de la ruta
const ESPERA_ALERTA_PROXIMIDAD = 3000; // tiempo extra cuando se dispara "casi_llega"
const ESPERA_ENTRE_VIAJES = 3000; // pausa entre el viaje de ida y el de vuelta

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const enviarEvento = async (tipo) => {
  console.log(`\n🎫 [EVENTO] -> ${tipo.toUpperCase()}`);
  await fetch(URL_RFID, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_rfid_uid: "A1B2C3D4",
      id_vehiculo: 1,
      tipo_evento: tipo,
    }),
  });
};

const enviarGPS = async (coordenada) => {
  console.log(
    `📡 [GPS] -> Lat: ${coordenada.lat}, Lng: ${coordenada.lng} | Vel: ${coordenada.vel} km/h`,
  );
  await fetch(URL_TELEMETRIA, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_vehiculo: 1,
      latitud: coordenada.lat,
      longitud: coordenada.lng,
      velocidad_kmh: coordenada.vel,
    }),
  });
};

// =========================================================
// VIAJE DE IDA: Casa -> Colegio
// =========================================================
const ejecutarViajeIda = async () => {
  console.log("\n========================================");
  console.log("🏠 ➜ 🏫  INICIANDO VIAJE DE IDA AL COLEGIO");
  console.log("========================================");

  await enviarEvento("abordaje");
  await esperar(ESPERA_EVENTO);

  await enviarEvento("arranca");
  await esperar(ESPERA_EVENTO);

  for (let i = 0; i < rutaIda.length; i++) {
    await enviarGPS(rutaIda[i]);

    if (i === rutaIda.length - 2) {
      // Penúltimo punto: avisamos que ya casi llega al colegio
      await enviarEvento("casi_llega");
      await esperar(ESPERA_ALERTA_PROXIMIDAD);
    } else if (i === rutaIda.length - 1) {
      // Último punto: llegó al colegio
      await enviarEvento("destino");
      await esperar(ESPERA_EVENTO);
    } else {
      await esperar(ESPERA_GPS);
    }
  }

  console.log("🏁 VIAJE DE IDA FINALIZADO. El estudiante está en el colegio.");
};

// =========================================================
// VIAJE DE VUELTA: Colegio -> Casa
// =========================================================
const ejecutarViajeVuelta = async () => {
  console.log("\n========================================");
  console.log("🏫 ➜ 🏠  INICIANDO VIAJE DE VUELTA A CASA");
  console.log("========================================");

  await enviarEvento("abordaje_vuelta");
  await esperar(ESPERA_EVENTO);

  await enviarEvento("arranca_vuelta");
  await esperar(ESPERA_EVENTO);

  for (let i = 0; i < rutaVuelta.length; i++) {
    await enviarGPS(rutaVuelta[i]);

    if (i === rutaVuelta.length - 2) {
      // Penúltimo punto: avisamos que ya casi llega a casa
      await enviarEvento("casi_llega_casa");
      await esperar(ESPERA_ALERTA_PROXIMIDAD);
    } else if (i === rutaVuelta.length - 1) {
      // Último punto: llegó a casa
      await enviarEvento("llego_casa");
      await esperar(ESPERA_EVENTO);
    } else {
      await esperar(ESPERA_GPS);
    }
  }

  console.log("🏁 VIAJE DE VUELTA FINALIZADO. El estudiante llegó a casa.");
};

// =========================================================
// CICLO COMPLETO: IDA + PAUSA + VUELTA
// =========================================================
const ejecutarSimulacion = async () => {
  console.log("🎬 INICIANDO DEMOSTRACIÓN PEKE TRAK...");

  await ejecutarViajeIda();

  console.log(
    `\n⏳ Pausa de ${ESPERA_ENTRE_VIAJES / 1000}s simulando la jornada escolar antes del regreso...`,
  );
  await esperar(ESPERA_ENTRE_VIAJES);

  await ejecutarViajeVuelta();

  console.log("\n✅ DEMOSTRACIÓN COMPLETA: CICLO IDA Y VUELTA FINALIZADO.");
};

ejecutarSimulacion();
