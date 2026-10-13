/* =========================================================
   CONFIGURACIÓN — cambia aquí los datos de la invitación
   ========================================================= */
const CONFIG = {
  quinceanera: { nombre: "Alitzel Yoselin", apellidos: "Ramírez Sampieri" },
  frase: "Hay noches que parecen sacadas de un cuento. Esta es la mía, y quiero vivirla contigo.",

  // Fecha y hora de inicio (zona horaria de México, -06:00)
  fechaEvento: "2026-12-19T19:00:00-06:00",
  fechaTexto: "Sábado 19 · Diciembre · 2026",
  fechaLimiteConfirmacion: "27 de noviembre de 2026",

  papas: ["José Feliciano Ramírez Rosas", "Monserrat Sampieri Fernández"],
  padrinos: ["José Manuel Ramírez Rosas", "Isabel del Carmen Sánchez Utrera"],

  misa: {
    titulo: "Misa de acción de gracias",
    lugar: "Catedral de la Inmaculada Concepción",
    direccion: "Córdoba, Veracruz",
    hora: "7:00 PM",
    mapsUrl: "",           // link de "Ver en Maps" (vacío = se busca por nombre y dirección)
    destino: "",           // coordenadas "18.88,-96.93" o dirección para "Cómo llegar" (vacío = nombre + dirección)
  },
  recepcion: {
    titulo: "Recepción",
    lugar: "Salón Flamingos Majestic",
    direccion: "Boulevard Córdoba-Fortín #4013, 94549 Córdoba, Ver. (frente a Nuevo Córdoba)",
    hora: "8:30 PM",
    mapsUrl: "https://share.google/mjdgCr57w8oF8qNJ2",
    destino: "Salón Flamingos Majestic, Boulevard Córdoba-Fortín 4013, 94549 Córdoba, Veracruz",
  },

  itinerario: [
    { hora: "7:00 PM", evento: "Misa de acción de gracias" },
    { hora: "8:30 PM", evento: "Recepción y bienvenida" },
    { hora: "9:00 PM", evento: "Entrada y vals" },
    { hora: "9:45 PM", evento: "Cena" },
    { hora: "11:00 PM", evento: "Baile sorpresa y fiesta" },
  ],

  vestimenta: {
    tipo: "Formal",
    detalle: "",           // vacío = no se muestra
    colorReservado: "#2E8B57",
    textoReservado: "El verde está reservado para la quinceañera",
  },

  regalos: {
    texto: "Si deseas obsequiarme algo, aquí está mi mesa de regalos.",
    tienda: "Liverpool",
    evento: "Número de evento: en trámite",
  },

  // Fase 2
  whatsapp: "522713594102",
  sheetsUrl: "",
  maxInvitados: 10,

  musica: "ARABIAN.mp3",     // en la raíz del repo; respeta mayúsculas
};

/* =========================================================
   Lógica (no es necesario modificar)
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);

function get(path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), CONFIG);
}

function mapsLinks(lugar) {
  const query = encodeURIComponent(`${lugar.lugar}, ${lugar.direccion}`);
  const ver = lugar.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${query}`;
  let llegar;
  if (lugar.destino) {
    llegar = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lugar.destino)}`;
  } else if (lugar.mapsUrl) {
    llegar = lugar.mapsUrl; // mientras no haya dirección, abre el mismo lugar
  } else {
    llegar = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  }
  return { ver, llegar };
}

function render() {
  // Textos simples: <el data-c="ruta.en.config">
  document.querySelectorAll("[data-c]").forEach((el) => {
    const v = get(el.dataset.c);
    if (v != null) el.textContent = v;
    el.hidden = v === "";
  });
  // Listas con salto de línea: <el data-lines="papas">
  document.querySelectorAll("[data-lines]").forEach((el) => {
    el.innerHTML = "";
    (get(el.dataset.lines) || []).forEach((line, i) => {
      if (i) el.appendChild(document.createElement("br"));
      el.appendChild(document.createTextNode(line));
    });
  });
  // Botones de mapas
  ["misa", "recepcion"].forEach((k) => {
    const { ver, llegar } = mapsLinks(CONFIG[k]);
    $(`[data-map="${k}-ver"]`).href = ver;
    $(`[data-map="${k}-llegar"]`).href = llegar;
  });
  // Itinerario
  const ul = $("#itinerario-lista");
  ul.innerHTML = "";
  CONFIG.itinerario.forEach((it) => {
    const li = document.createElement("li");
    const h = document.createElement("span");
    h.className = "it-hora";
    h.textContent = it.hora;
    const e = document.createElement("span");
    e.className = "it-evento";
    e.textContent = it.evento;
    li.append(h, e);
    ul.appendChild(li);
  });
  // Color reservado
  $("#color-reservado").style.background = CONFIG.vestimenta.colorReservado;
  document.title = `Mis XV Años · ${CONFIG.quinceanera.nombre}`;
}

/* ---------- Cuenta regresiva ---------- */
function countdown() {
  const target = new Date(CONFIG.fechaEvento).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    $("#cd-d").textContent = d;
    $("#cd-h").textContent = pad(h);
    $("#cd-m").textContent = pad(m);
    $("#cd-s").textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- Portada + música ---------- */
function setupCover() {
  const audio = $("#bgm");
  audio.src = CONFIG.musica;
  const btn = $("#music-toggle");

  function setIcon(playing) {
    btn.classList.toggle("is-playing", playing);
    btn.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
  }

  $("#open-invitation").addEventListener("click", () => {
    document.body.classList.add("opened");
    audio.play().then(() => setIcon(true)).catch(() => setIcon(false));
    window.scrollTo(0, 0);
  });

  btn.addEventListener("click", () => {
    if (audio.paused) audio.play().then(() => setIcon(true)).catch(() => {});
    else { audio.pause(); setIcon(false); }
  });
}

/* ---------- Aparición al hacer scroll ---------- */
function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  els.forEach((e) => io.observe(e));
}

/* ---------- Confirmación (se conecta en la Fase 2) ---------- */
function setupRSVP() {
  document.querySelectorAll("[data-rsvp]").forEach((b) =>
    b.addEventListener("click", () => console.log("RSVP:", b.dataset.rsvp, "— pendiente Fase 2"))
  );
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  countdown();
  setupCover();
  setupReveal();
  setupRSVP();
});
