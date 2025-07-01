const apiUrl = "http://54.84.152.232:5000/"; // Cambia a tu IP pública si es necesario
let clientIp = "0.0.0.0"; // Valor predeterminado en caso de error

const statusMap = {
  1: "Adelante",
  2: "Atras",
  3: "Detener",
  4: "derecha",
  5: "izquierda",
  6: "derecha_atras",
  7: "izquierda_atras",
  8: "Giro90derecha",
  9: "Giro90izquierda",
  10: "Giro360derecha",
  11: "Giro360izquierda"
};

async function getClientIp() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    clientIp = data.ip;
  } catch (error) {
    console.warn("No se pudo obtener la IP pública. Se usará 0.0.0.0");
  }
}

async function fetchLastStatus() {
  try {
    const res = await fetch(`${apiUrl}/devices/last-status`);
    const data = await res.json();
    document.getElementById("movement").textContent = data[0]?.status_texto || "Sin datos";
  } catch (err) {
    document.getElementById("movement").textContent = "Error de conexión";
  }
}

async function sendCommand(status_clave) {
  const payload = {
    name: "Dispostivo IoT de Beco",
    ip: clientIp,
    status_clave: status_clave,
    status_texto: statusMap[status_clave]
  };

  try {
    await fetch(`${apiUrl}/devices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    alert("Error al enviar el comando");
  }
}

// Inicializar IP y comenzar actualización cada 2 segundos
getClientIp().then(() => {
  fetchLastStatus();
  setInterval(fetchLastStatus, 2000);
});
