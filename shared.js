/* =========================================================
   Atlántica Conservas · datos y utilidades compartidas
   (los usan index.html y muestras.html)
   ========================================================= */

/* ---- CONFIGURACIÓN -------------------------------------------------
   n8nFormUrl: URL de producción del formulario de n8n («Contáctanos»).
   publicUrl:  dirección pública de la web cuando se publique. Los QR de
               las latas apuntan aquí. Vacío = la dirección actual.       */
const CONFIG = {
  n8nFormUrl: "",
  publicUrl: "https://carlosparsaa-design.github.io/atlantica/",
};

/* ---- PRODUCTOS (precios de venta al público, IVA incluido) ---------- */
const PRODUCTS = [
  { id: "ventresca", line: "Reserva", name: "Ventresca de bonito del norte", full: "Ventresca de bonito del norte en aceite de oliva virgen extra",
    short: "Ventresca", sub: "de bonito del norte", weight: "115 g", price: 29.9, cat: "aceite", box: 24,
    lid: "#10161f", photo: "ventresca.jpg", medal: "bonito.jpg", medalPos: "45% 50%", medalBg: "#f4efe6",
    desc: "La parte más jugosa del bonito del norte, cortada a mano y cubierta de aceite de oliva virgen extra. Producción limitada por campaña.",
    cata: "Untuosa, se deshace en láminas. Sabor suave y largo.", maridaje: "Albariño de las Rías Baixas con crianza sobre lías." },
  { id: "bonito", line: "Clásica", name: "Bonito del norte", full: "Bonito del norte en aceite de oliva virgen extra",
    short: "Bonito", sub: "del norte", weight: "250 g", price: 19.9, cat: "aceite", box: 12,
    lid: "#16273d", photo: "bonito.jpg", medal: "bonito.jpg", medalPos: "40% 50%", medalBg: "#f4efe6",
    desc: "Lomos de bonito del norte pescado a caña en el Cantábrico y desembarcado en el puerto de Burela.",
    cata: "Carne firme y jugosa, en lascas limpias.", maridaje: "Godello de Valdeorras." },
  { id: "pulpo", line: "Clásica", name: "Pulpo de Galicia", full: "Pulpo de Galicia en aceite de oliva virgen extra",
    short: "Pulpo", sub: "de Galicia", weight: "111 g", price: 24.9, cat: "aceite", box: 24,
    lid: "#4a1a1f", photo: "pulpo.jpg", medal: "pulpo.jpg", medalPos: "50% 45%",
    desc: "Pulpo de nasa de la lonja de Burela, cocido al estilo tradicional y cortado a mano.",
    cata: "Tierno, con el punto exacto de cocción.", maridaje: "Mencía joven de la Ribeira Sacra." },
  { id: "sardinillas", line: "Clásica", name: "Sardinillas", full: "Sardinillas en aceite de oliva virgen extra",
    short: "Sardinillas", sub: "en aceite de oliva", weight: "90 g", price: 15.99, cat: "aceite", box: 48,
    lid: "#173630", photo: "sardinas.jpg", medal: "sardinas.jpg", medalPos: "50% 50%",
    desc: "Sardinas pequeñas de la costa gallega, limpias y colocadas una a una en la lata.",
    cata: "Delicadas, con una espina tan fina que se come.", maridaje: "Un espumoso brut bien frío." },
  { id: "zamburinas", line: "Clásica", name: "Zamburiñas en escabeche", full: "Zamburiñas en escabeche de receta propia",
    short: "Zamburiñas", sub: "en escabeche", weight: "111 g", price: 18.9, cat: "escabeche", box: 24,
    lid: "#33263f", photo: "zamburinas.jpg", medal: "zamburinas-conchas.jpg", medalPos: "50% 50%",
    desc: "Zamburiñas de las rías gallegas en un escabeche suave con pimentón y laurel.",
    cata: "Dulces, con un final de pimentón ahumado.", maridaje: "Treixadura del Ribeiro." },
  { id: "coleccion", line: "Estuche", name: "Colección Atlántica", full: "Colección Atlántica · estuche de las 5 latas",
    short: "Colección", sub: "Atlántica", weight: "5 latas en estuche de madera", price: 99, cat: "regalo",
    lid: "#10161f", photo: "puerto-burela.jpg", medal: "puerto-burela.jpg", medalPos: "50% 60%",
    desc: "Ventresca, bonito del norte, pulpo, sardinillas y zamburiñas en un estuche de madera con tarjeta manuscrita.",
    cata: "Un recorrido por lo mejor de nuestra costa.", maridaje: "Para compartir." },
];
const P = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

/* ---- LOTES ---------------------------------------------------------- */
const LOTS = {
  "AC-2611-V02": { product: "ventresca", species: "Bonito del norte (ventresca)", zone: "Cantábrico · FAO 27.VIIIc", lonja: "Lonja de Burela", gear: "Curricán, pieza a pieza", caught: "03/11/2026", packed: "06/11/2026", best: "31/12/2031", temp: "1,9 °C", cans: 1920, auto: "118,8 °C" },
  "AC-2611-B07": { product: "bonito", species: "Bonito del norte", zone: "Cantábrico · FAO 27.VIIIc", lonja: "Lonja de Burela", gear: "Curricán, pieza a pieza", caught: "03/11/2026", packed: "05/11/2026", best: "31/12/2031", temp: "1,8 °C", cans: 4812, auto: "119,1 °C" },
  "AC-2610-P03": { product: "pulpo", species: "Pulpo", zone: "Cantábrico · FAO 27.VIIIc", lonja: "Lonja de Burela", gear: "Nasa", caught: "14/10/2026", packed: "16/10/2026", best: "31/12/2031", temp: "2,0 °C", cans: 3105, auto: "119,4 °C" },
  "AC-2610-S12": { product: "sardinillas", species: "Sardina", zone: "Atlántico · FAO 27.IXa", lonja: "Lonja de Ribeira", gear: "Cerco", caught: "21/10/2026", packed: "22/10/2026", best: "31/12/2031", temp: "1,5 °C", cans: 6240, auto: "118,7 °C" },
  "AC-2610-Z05": { product: "zamburinas", species: "Zamburiña", zone: "Atlántico · FAO 27.IXa", lonja: "Lonja de Cambados", gear: "Rastro", caught: "09/10/2026", packed: "10/10/2026", best: "31/12/2031", temp: "1,6 °C", cans: 2860, auto: "119,0 °C" },
};

/* ---- LAS 5 LATAS DE MUESTRA (cada lata tiene su propio código y QR) -- */
const CANS = {
  "AC-2611-V02-0187": { lot: "AC-2611-V02", n: 187, inspected: "06/11/2026 · 09:14:52", station: 4, cycle: "C-1103", fill: "Correcto" },
  "AC-2611-B07-1294": { lot: "AC-2611-B07", n: 1294, inspected: "05/11/2026 · 11:02:37", station: 9, cycle: "C-1097", fill: "Correcto" },
  "AC-2610-P03-0526": { lot: "AC-2610-P03", n: 526, inspected: "16/10/2026 · 10:47:05", station: 2, cycle: "C-1012", fill: "Correcto" },
  "AC-2610-S12-3071": { lot: "AC-2610-S12", n: 3071, inspected: "22/10/2026 · 12:31:19", station: 11, cycle: "C-1041", fill: "Correcto" },
  "AC-2610-Z05-0842": { lot: "AC-2610-Z05", n: 842, inspected: "10/10/2026 · 08:58:44", station: 6, cycle: "C-0998", fill: "Correcto" },
};
const canProduct = (code) => P[LOTS[CANS[code].lot].product];

/* ---- CRÉDITOS DE LAS FOTOS (Wikimedia Commons) ---------------------- */
const PHOTO_CREDITS = [
  ["Puerto de Burela", "Javierfernandezalvarez", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Puerto_de_Burela.jpg"],
  ["Barcos en Burela", "Fernando Losada Rodríguez", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Barcos.001_-_Burela.jpg"],
  ["Barco en el puerto de Burela", "Fernando Losada Rodríguez", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Barco_Faro_de_Burela.001_-_Burela.jpg"],
  ["Praia das Catedrais", "Agremon", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Catedrais_4.jpg"],
  ["Bonito del norte (Thunnus alalunga)", "Hugues Evano (IFREMER)", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Thon_germon_(Thunnus_alalunga)_(Ifremer_00764-87615).jpg"],
  ["Ventresca de atún", "City Foodsters", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Course_-4-_Ventresca_de_at%C3%BAn_(tuna_belly)_con_pur%C3%A9_de_coliflor_y_vinegreta_tibia_de_lentejas_(11380047956).jpg"],
  ["Sardinas", "Friedrich Haag", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:2014_03_19_397_Eingelegte_Fische.jpg"],
  ["Pulpo a la gallega", "Juan Emilio Prades Bel", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Plato_de_pulpo_a_la_gallega.jpg"],
  ["Zamburiñas a la plancha", "Laura Alles enrich", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Zamburi%C3%B1as_a_la_plancha.jpg"],
  ["Zamburiñas y volandeiras", "P. Lameiro", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Zamburi%C3%B1as_e_volandeiras_02-04.JPG"],
];

/* ---- Utilidades ----------------------------------------------------- */
const AC = (() => {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const eur = (n) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
  const num = (n) => n.toLocaleString("es-ES");
  const store = {
    get(k, d) { try { const v = localStorage.getItem("ac_" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("ac_" + k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
  };

  // Dirección que codifica el QR de cada lata
  const base = () => (CONFIG.publicUrl || (location.origin + location.pathname.replace(/[^/]*$/, ""))).replace(/\/?$/, "/");
  const qrPayload = (code) => `${base()}#lata=${code}`;
  // Extrae el código de lata de un QR leído o de un texto escrito
  const parseCode = (text) => {
    const m = String(text).toUpperCase().match(/AC-\d{4}-[A-Z]\d{2}-\d{4}/);
    return m ? m[0] : String(text).trim().toUpperCase();
  };

  // QR real (librería qrcode-generator)
  function drawQR(canvas, text, { dark = "#111", light = "#fff", scale = 6, margin = 2 } = {}) {
    const qr = qrcode(0, "M");
    qr.addData(text); qr.make();
    const n = qr.getModuleCount(), size = (n + margin * 2) * scale;
    canvas.width = canvas.height = size;
    const c = canvas.getContext("2d");
    c.fillStyle = light; c.fillRect(0, 0, size, size); c.fillStyle = dark;
    for (let r = 0; r < n; r++) for (let col = 0; col < n; col++) if (qr.isDark(r, col)) c.fillRect((col + margin) * scale, (r + margin) * scale, scale, scale);
    return canvas;
  }

  // Lata vista desde arriba: tapa litografiada con medallón fotográfico
  function tin(p, { cls = "" } = {}) {
    return `<div class="tin ${cls}" style="--lid:${p.lid}">
      <div class="tin__body">
        <div class="tin__lid">
          <span class="tin__ring" aria-hidden="true"></span>
          <div class="tin__art">
            <span class="tin__brand">ATLÁNTICA</span>
            <span class="tin__place">Conservas · Burela</span>
            <span class="tin__medal" style="background:${p.medalBg || "#222"}"><img src="${p.medal}" alt="" style="object-position:${p.medalPos}" loading="lazy"></span>
            <span class="tin__name"${p.short.length > 9 ? " style=\"font-size:6.6cqw\"" : ""}>${esc(p.short)}</span>
            <span class="tin__sub">${esc(p.sub)}</span>
            ${p.line === "Reserva" ? '<span class="tin__badge">Reserva</span>' : ""}
          </div>
        </div>
      </div>
    </div>`;
  }

  // Base de la lata (lo que ve quien la tiene en la mano): QR + código grabado
  function tinBack(code) {
    const c = CANS[code], l = LOTS[c.lot];
    return `<div class="tin tin--back">
      <div class="tin__body"><div class="tin__lid tin__lid--metal">
        <div class="tin__print">
          <canvas class="tin__qr" data-qr="${code}"></canvas>
          <div class="tin__ink">
            <b>${code}</b>
            <span>LOTE ${c.lot}</span>
            <span>LATA Nº ${String(c.n).padStart(4, "0")}</span>
            <span>C. PREF. ${l.best}</span>
            <span>ESCANEA · VERIFICA</span>
          </div>
        </div>
      </div></div>
    </div>`;
  }
  const paintQRs = (root = document) => root.querySelectorAll("canvas[data-qr]").forEach((cv) => drawQR(cv, qrPayload(cv.dataset.qr), { dark: "#2b2f36", light: "rgba(0,0,0,0)", scale: 5, margin: 1 }));

  return { esc, eur, num, store, qrPayload, parseCode, drawQR, tin, tinBack, paintQRs };
})();
