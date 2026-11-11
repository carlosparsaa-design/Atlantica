/* =========================================================
   Atlántica Conservas · web de clientes
   Web de demostración: pedidos e incidencias se guardan solo en este navegador.
   Datos de productos, lotes y latas: shared.js
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const { esc, eur, num, store } = AC;
  const today = () => new Date().toLocaleDateString("es-ES");
  const now = () => new Date().toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
  const newCode = (prefix, taken) => { let c; do { c = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`; } while (taken(c)); return c; };

  /* ---------- Avisos y ventanas ---------- */
  let toastTimer;
  const toast = (msg) => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2800); };
  const modal = $("#modal"), modalBox = $("#modalBox");
  let onModalClose = null;
  const openModal = (html, { wide = false } = {}) => {
    $("#modalBody").innerHTML = html;
    modalBox.classList.toggle("modal__box--wide", wide);
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("lock");
    $(".x", modal).focus();
  };
  const closeModal = () => {
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
    if (!drawer.classList.contains("open")) document.body.classList.remove("lock");
    if (onModalClose) { onModalClose(); onModalClose = null; }
  };
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeDrawer(); } });
  const goTo = (id) => document.getElementById(id).scrollIntoView({ behavior: "smooth" });

  /* ---------- Navegación ---------- */
  const burger = $("#burger"), mm = $("#mobileMenu");
  burger.addEventListener("click", () => { const o = mm.classList.toggle("open"); burger.setAttribute("aria-expanded", String(o)); });
  $$("a", mm).forEach((a) => a.addEventListener("click", () => { mm.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));
  const navMap = new Map($$(".nav__links a[href^='#']").map((a) => [a.getAttribute("href").slice(1), a]));
  const secObs = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    navMap.forEach((a) => a.classList.remove("active")); navMap.get(e.target.id)?.classList.add("active");
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => secObs.observe(s));
  const revObs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); revObs.unobserve(e.target); } }), { threshold: 0.08 });
  $$(".reveal").forEach((el) => revObs.observe(el));

  const tabs = (id) => {
    const wrap = document.getElementById(id);
    const show = (tab) => $$("button", wrap).forEach((b) => {
      const on = b.dataset.tab === tab;
      b.classList.toggle("active", on); b.setAttribute("aria-selected", on);
      document.getElementById(b.dataset.tab).classList.toggle("active", on);
    });
    $$("button", wrap).forEach((b) => b.addEventListener("click", () => show(b.dataset.tab)));
    return show;
  };
  const showB2B = tabs("b2bTabs"), showCare = tabs("careTabs");

  /* ---------- Hero ---------- */
  $("#heroCan").insertAdjacentHTML("afterbegin", AC.tin(P.ventresca));

  /* =========================================================
     COLECCIÓN
     ========================================================= */
  const grid = $("#productGrid");
  grid.innerHTML = PRODUCTS.map((p, i) => `
    <article class="prod reveal" data-cat="${p.cat}" style="transition-delay:${(i % 3) * 120}ms">
      <button class="prod__stage" data-view="${p.id}" aria-label="Ver ${esc(p.name)}">
        <span class="prod__photo" style="background-image:url('${p.photo}')"></span>
        <span class="prod__line">${p.line}</span>
        ${AC.tin(p)}
      </button>
      <div class="prod__body">
        <h3>${p.name}</h3>
        <div class="prod__meta">${p.weight}</div>
        <div class="prod__price">${eur(p.price)}</div>
        <div class="prod__actions"><button class="btn btn--ink btn--sm" data-add="${p.id}">Añadir a la cesta</button><button class="link" data-view="${p.id}">Detalles</button></div>
      </div>
    </article>`).join("");
  $$(".prod", grid).forEach((el) => revObs.observe(el));
  $$("#filters button").forEach((b) => b.addEventListener("click", () => {
    $$("#filters button").forEach((x) => x.classList.toggle("active", x === b));
    $$(".prod", grid).forEach((c) => (c.hidden = b.dataset.f !== "todo" && c.dataset.cat !== b.dataset.f));
  }));
  grid.addEventListener("click", (e) => {
    const a = e.target.closest("[data-add]"); if (a) addToCart(a.dataset.add);
    const v = e.target.closest("[data-view]"); if (v) openProduct(v.dataset.view);
  });

  function openProduct(id) {
    const p = P[id];
    const lot = Object.entries(LOTS).find(([, l]) => l.product === id);
    openModal(`<div class="pdp">
      <div class="pdp__img" style="background-image:linear-gradient(0deg,rgba(13,20,31,.55),rgba(13,20,31,.05)),url('${p.photo}')">${AC.tin(p)}</div>
      <div class="pdp__info">
        <span class="kicker">${p.line}</span>
        <h3>${p.name}</h3>
        <p style="margin:.4rem 0 0;color:var(--muted)">${p.full} · ${p.weight}</p>
        <div class="pdp__price">${eur(p.price)}</div>
        <p>${p.desc}</p>
        <dl>
          <div><dt>Nota de cata</dt><dd>${p.cata}</dd></div>
          <div><dt>Maridaje</dt><dd>${p.maridaje}</dd></div>
          ${lot ? `<div><dt>Origen de la campaña actual</dt><dd>${lot[1].lonja} · ${lot[1].zone} · ${lot[1].gear}</dd></div>` : `<div><dt>Incluye</dt><dd>Una lata de cada referencia, cada una con su propio QR.</dd></div>`}
        </dl>
        <button class="btn btn--gold btn--full" id="pdpAdd">Añadir a la cesta</button>
      </div></div>`, { wide: true });
    $("#pdpAdd").addEventListener("click", () => { addToCart(id); closeModal(); });
  }

  /* =========================================================
     CESTA
     ========================================================= */
  const FREE = 60, SHIP = 6.9;
  let cart = store.get("cart", []).filter((l) => P[l.id]);
  let checkout = false;
  const drawer = $("#drawer");
  const openDrawer = () => { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); document.body.classList.add("lock"); renderCart(); };
  function closeDrawer() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); if (!modal.classList.contains("open")) document.body.classList.remove("lock"); checkout = false; }
  $("#cartOpen").addEventListener("click", openDrawer);
  drawer.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeDrawer(); });
  const count = () => {
    const n = cart.reduce((a, l) => a + l.qty, 0), el = $("#cartCount");
    el.textContent = n; el.classList.add("bump"); setTimeout(() => el.classList.remove("bump"), 200);
  };
  function addToCart(id) {
    const l = cart.find((x) => x.id === id); l ? l.qty++ : cart.push({ id, qty: 1 });
    store.set("cart", cart); count(); toast(`Añadido a tu cesta · ${P[id].name}`);
    if (drawer.classList.contains("open")) renderCart();
  }
  const setQty = (id, q) => { cart = cart.map((l) => (l.id === id ? { ...l, qty: q } : l)).filter((l) => l.qty > 0); store.set("cart", cart); count(); renderCart(); };
  function renderCart() {
    const body = $("#cartBody"), foot = $("#cartFoot");
    if (!cart.length) { body.innerHTML = `<div class="empty"><h4>Tu cesta está vacía</h4><a href="#coleccion" class="btn btn--ink btn--sm" data-close>Ver la colección</a></div>`; foot.innerHTML = ""; return; }
    body.innerHTML = cart.map((l) => { const p = P[l.id]; return `<div class="citem">${AC.tin(p)}
      <div><b>${p.name}</b><small>${p.weight}</small>
        <div class="qty"><button data-q="-1" data-id="${p.id}" aria-label="Quitar una">−</button><input value="${l.qty}" readonly aria-label="Cantidad"><button data-q="1" data-id="${p.id}" aria-label="Añadir una">+</button></div></div>
      <div><div class="citem__price">${eur(p.price * l.qty)}</div><button class="citem__del" data-del="${p.id}">Quitar</button></div></div>`; }).join("");
    const sub = cart.reduce((a, l) => a + P[l.id].price * l.qty, 0), ship = sub >= FREE ? 0 : SHIP;
    foot.innerHTML = checkout ? `
      <form class="checkout" id="checkoutForm">
        <label class="field">Nombre y apellidos<input name="nombre" required autocomplete="name"></label>
        <label class="field">Correo electrónico<input name="email" type="email" required autocomplete="email"></label>
        <label class="field">Dirección de envío<input name="dir" required autocomplete="street-address"></label>
        <label class="field">Código postal y ciudad<input name="cp" required autocomplete="postal-code"></label>
        <label class="gift"><input type="checkbox" name="regalo"><span>Envolver para regalo con tarjeta manuscrita</span></label>
        <p class="paydemo">Web de demostración: no se realiza ningún cobro.</p>
        <div class="sumline sumline--total"><span>Total</span><span>${eur(sub + ship)}</span></div>
        <button class="btn btn--gold btn--full">Confirmar pedido</button>
        <button type="button" class="link" id="backCart" style="justify-self:center">Volver a la cesta</button>
      </form>` : `
      <div class="ship">${ship ? `Te faltan ${eur(FREE - sub)} para el envío gratuito` : "Envío gratuito"}<div class="ship__bar"><span style="width:${Math.min(100, (sub / FREE) * 100)}%"></span></div></div>
      <div class="sumline"><span>Subtotal</span><span>${eur(sub)}</span></div>
      <div class="sumline"><span>Envío</span><span>${ship ? eur(ship) : "Gratuito"}</span></div>
      <div class="sumline sumline--total"><span>Total</span><span>${eur(sub + ship)}</span></div>
      <button class="btn btn--gold btn--full" id="toCheckout">Finalizar compra</button>`;
    $$("[data-q]", body).forEach((b) => b.addEventListener("click", () => { const l = cart.find((x) => x.id === b.dataset.id); setQty(l.id, l.qty + +b.dataset.q); }));
    $$("[data-del]", body).forEach((b) => b.addEventListener("click", () => setQty(b.dataset.del, 0)));
    $("#toCheckout")?.addEventListener("click", () => { checkout = true; renderCart(); $("#checkoutForm input").focus(); });
    $("#backCart")?.addEventListener("click", () => { checkout = false; renderCart(); });
    $("#checkoutForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target), all = orders();
      const o = { code: newCode("PED", (c) => all[c]), type: "b2c", date: today(), step: 0, name: f.get("nombre"), lines: cart.map((l) => ({ ...l })), ship, gift: !!f.get("regalo"), carrier: "Mensajería 24-48 h" };
      saveOrder(o); cart = []; store.set("cart", cart); count(); closeDrawer();
      openModal(`<div class="seal">✓</div><h3>Gracias, ${esc(o.name.split(" ")[0])}</h3>
        <p>Hemos recibido tu pedido</p><p class="code">${o.code}</p>
        <p>Cada lata llegará con su propio código. Cuando la tengas, verifícala en «Verifica tu lata».${o.gift ? " Lo envolveremos para regalo." : ""}</p>
        <button class="btn btn--ink" data-close id="seeOrder">Seguir mi pedido</button>`);
      $("#seeOrder").addEventListener("click", () => { trackLookup(o.code); showCare("careTrack"); goTo("atencion"); });
    });
  }
  count();

  /* =========================================================
     VERIFICA TU LATA
     ========================================================= */
  const result = $("#result");
  const emptyResult = () => {
    result.innerHTML = `<div class="result__empty">${AC.tin(P.bonito)}<h3>Tu lata aparecerá aquí</h3><p>Escanea el QR de la base, sube una foto o escribe el código que aparece junto a él.</p></div>`;
  };
  emptyResult();

  function verify(raw, { scroll = true } = {}) {
    const code = AC.parseCode(raw);
    $("#codeInput").value = code;
    if (scroll) goTo("verifica");
    const can = CANS[code];
    if (!can) {
      const looksReal = /^AC-\d{4}-[A-Z]\d{2}-\d{4}$/.test(code);
      result.innerHTML = `<div class="fake"><div class="fake__ico">!</div>
        <h3>${looksReal ? "Esta lata no figura en nuestro registro" : "Código no reconocido"}</h3>
        <p class="muted">${looksReal ? "Cada lata auténtica de Atlántica está registrada con su código. Si la has comprado en una tienda, escríbenos y lo revisamos." : "Revisa el código grabado junto al QR. Tiene este formato: AC-0000-X00-0000."}</p>
        <button class="btn btn--line btn--sm" id="fakeHelp">Avisar a atención al cliente</button></div>`;
      $("#fakeHelp").addEventListener("click", () => { showCare("careClaim"); goTo("atencion"); });
      return;
    }
    const l = LOTS[can.lot], p = P[l.product];
    const scans = store.get("scans", {}), s = scans[code] || { count: 0, first: now() };
    s.count++; scans[code] = s; store.set("scans", scans);
    const scanText = s.count === 1 ? "Primera verificación de esta lata." : `Verificada ${s.count} veces · la primera, el ${s.first}.`;
    result.innerHTML = `
      <div class="auth">${AC.tin(p)}
        <div><span class="auth__seal"><i>✓</i>Lata auténtica</span>
          <h3>${p.name}</h3>
          <div class="auth__code">${code} · lata nº ${num(can.n)} de ${num(l.cans)}</div>
          <div class="auth__scans">${scanText}</div></div></div>
      <div class="rtabs" role="tablist"><button class="active" data-rt="lata">Tu lata</button><button data-rt="origen">Origen</button><button data-rt="degusta">Degustación</button></div>
      <div class="rbody" id="rbody"></div>
      <div class="rfoot"><button class="btn btn--ink btn--sm" id="rebuy">Volver a comprar · ${eur(p.price)}</button><button class="link" id="canIssue">¿Algún problema con esta lata?</button></div>`;
    const views = {
      lata: `<p class="muted" style="margin-top:0">Revisada el ${can.inspected}. Empacada a mano en el puesto ${can.station}.</p>
        <ul class="checks">
          <li><span>Colocación de las piezas</span><span>Superado</span></li>
          <li><span>Sin restos de piel ni espinas</span><span>Superado</span></li>
          <li><span>Nivel de llenado</span><span>${can.fill}</span></li>
          <li><span>Cierre de la lata</span><span>Superado</span></li>
          <li><span>Esterilización · ciclo ${can.cycle} · mínimo ${l.auto}</span><span>Superado</span></li>
        </ul>`,
      origen: `<div class="facts">
          <div><small>Especie</small><b>${l.species}</b></div>
          <div><small>Zona de captura</small><b>${l.zone}</b></div>
          <div><small>Lonja</small><b>${l.lonja}</b></div>
          <div><small>Arte de pesca</small><b>${l.gear}</b></div>
          <div><small>Captura</small><b>${l.caught}</b></div>
          <div><small>Envasado</small><b>${l.packed}</b></div>
          <div><small>Temperatura a la llegada</small><b>${l.temp}</b></div>
          <div><small>Consumo preferente</small><b>${l.best}</b></div>
        </div>`,
      degusta: `<div class="pairing"><img src="${p.photo}" alt="" loading="lazy"><div>
          <h4>${p.name}</h4><small>Nota de cata</small><p>${p.cata}</p><small>Maridaje</small><p>${p.maridaje}</p>
          <small>Servicio</small><p>Ábrela unos minutos antes y sírvela a temperatura ambiente, con su propio aceite.</p></div></div>`,
    };
    const rbody = $("#rbody");
    const show = (v) => { $$("[data-rt]", result).forEach((b) => b.classList.toggle("active", b.dataset.rt === v)); rbody.innerHTML = views[v]; rbody.style.animation = "none"; void rbody.offsetWidth; rbody.style.animation = ""; };
    $$("[data-rt]", result).forEach((b) => b.addEventListener("click", () => show(b.dataset.rt)));
    $("#rebuy").addEventListener("click", () => addToCart(p.id));
    $("#canIssue").addEventListener("click", () => { $("#claimCan").value = code; showCare("careClaim"); goTo("atencion"); });
    show("lata");
  }
  $("#codeForm").addEventListener("submit", (e) => { e.preventDefault(); verify($("#codeInput").value, { scroll: false }); });

  // Escanear con la cámara
  $("#scanCam").addEventListener("click", async () => {
    if (!navigator.mediaDevices?.getUserMedia) { toast("Este navegador no permite usar la cámara. Sube una foto del QR."); return; }
    openModal(`<h3>Escanea el QR</h3><p>Apunta a la base de la lata.</p><div class="scanner"><video playsinline muted></video><div class="scanner__frame"></div><p class="scanner__msg">Buscando el código…</p></div>`);
    const video = $(".scanner video", modal), cv = document.createElement("canvas"), cx = cv.getContext("2d", { willReadFrequently: true });
    let stream, raf, done = false;
    onModalClose = () => { done = true; cancelAnimationFrame(raf); stream?.getTracks().forEach((t) => t.stop()); };
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      if (done) { stream.getTracks().forEach((t) => t.stop()); return; }
      video.srcObject = stream; await video.play();
    } catch {
      $(".scanner__msg", modal).textContent = "No hemos podido abrir la cámara. Revisa el permiso o sube una foto.";
      return;
    }
    const tick = () => {
      if (done) return;
      if (video.readyState >= 2) {
        const w = 640, h = Math.round((video.videoHeight / video.videoWidth) * w) || 480;
        cv.width = w; cv.height = h; cx.drawImage(video, 0, 0, w, h);
        const hit = jsQR(cx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: "dontInvert" });
        if (hit && hit.data) { closeModal(); verify(hit.data); return; }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
  });

  // Subir una foto del QR
  $("#scanFile").addEventListener("change", async (e) => {
    const file = e.target.files[0]; e.target.value = "";
    if (!file) return;
    toast("Leyendo el código…");
    const img = new Image();
    try {
      await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko; img.src = URL.createObjectURL(file); });
    } catch { toast("No hemos podido abrir la imagen."); return; }
    const cv = document.createElement("canvas"), cx = cv.getContext("2d", { willReadFrequently: true });
    let found = null;
    for (const max of [1400, 1000, 700, 450]) {
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
      cx.fillStyle = "#fff"; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(img, 0, 0, cv.width, cv.height);
      const hit = jsQR(cx.getImageData(0, 0, cv.width, cv.height).data, cv.width, cv.height, { inversionAttempts: "attemptBoth" });
      if (hit && hit.data) { found = hit.data; break; }
    }
    URL.revokeObjectURL(img.src);
    if (found) verify(found); else toast("No encontramos un QR en la foto. Prueba con una imagen más cercana y nítida.");
  });

  // El QR de cada lata abre directamente su verificación: …/#lata=AC-2611-B07-1294
  const fromHash = () => { const m = location.hash.match(/lata=([\w-]+)/i); if (m) setTimeout(() => verify(m[1]), 250); };
  addEventListener("hashchange", fromHash); fromHash();

  /* =========================================================
     PROFESIONALES
     ========================================================= */
  const b2b = PRODUCTS.filter((p) => p.box);
  const wholesale = (p) => Math.round(p.price * 0.62 * p.box * 100) / 100;
  const qtyB = Object.fromEntries(b2b.map((p) => [p.id, 0]));
  $("#b2bTable").innerHTML = `<div class="b2row b2row--head"><span>Referencia</span><span>Formato</span><span>Precio caja</span><span>Cajas</span></div>` +
    b2b.map((p) => `<div class="b2row"><div><b>${p.name}</b><small>${p.weight}</small></div><span>${p.box} latas</span><span>${eur(wholesale(p))}</span>
      <div class="qty"><button type="button" data-b="-1" data-id="${p.id}" aria-label="Quitar caja">−</button><input type="number" min="0" value="0" data-in="${p.id}" aria-label="Cajas de ${esc(p.name)}"><button type="button" data-b="1" data-id="${p.id}" aria-label="Añadir caja">+</button></div></div>`).join("");
  const MIN_BOXES = 5;
  const renderB2B = () => {
    let boxes = 0, units = 0, total = 0;
    b2b.forEach((p) => { const q = qtyB[p.id]; boxes += q; units += q * p.box; total += q * wholesale(p); $(`[data-in="${p.id}"]`).value = q; });
    $("#b2bBoxes").textContent = boxes; $("#b2bUnits").textContent = num(units); $("#b2bTotal").textContent = eur(total);
    $("#b2bSubmit").disabled = boxes < MIN_BOXES;
    $("#b2bHint").textContent = boxes < MIN_BOXES ? `Pedido mínimo: ${MIN_BOXES} cajas (faltan ${MIN_BOXES - boxes}).` : "La documentación de cada lote estará disponible al momento.";
  };
  $("#b2bTable").addEventListener("click", (e) => { const b = e.target.closest("[data-b]"); if (b) { qtyB[b.dataset.id] = Math.max(0, qtyB[b.dataset.id] + +b.dataset.b); renderB2B(); } });
  $("#b2bTable").addEventListener("change", (e) => { const i = e.target.closest("[data-in]"); if (i) { qtyB[i.dataset.in] = Math.max(0, parseInt(i.value, 10) || 0); renderB2B(); } });
  renderB2B();
  const lotOf = (id) => Object.keys(LOTS).find((k) => LOTS[k].product === id);
  $("#b2bForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target), all = orders();
    const o = { code: newCode("PED-B2B", (c) => all[c]), type: "b2b", date: today(), step: 0, name: f.get("empresa"), tipo: f.get("tipo"), pais: f.get("pais"),
      lines: b2b.filter((p) => qtyB[p.id]).map((p) => ({ id: p.id, qty: qtyB[p.id] })), carrier: f.get("pais") === "España" ? "Transporte nacional" : "Transporte internacional" };
    saveOrder(o); b2b.forEach((p) => (qtyB[p.id] = 0)); renderB2B(); e.target.reset();
    openModal(`<div class="seal">✓</div><h3>Pedido recibido</h3><p class="code">${o.code}</p>
      <p>${esc(o.name)} · ${esc(o.tipo)} · ${esc(o.pais)}</p>
      <p>Certificado sanitario${o.pais !== "España" ? ", documentación de exportación" : ""} y factura ya disponibles.</p>
      <button class="btn btn--ink" data-close id="goDocs">Ver documentación</button>`);
    $("#goDocs").addEventListener("click", () => { showB2B("b2bDocs"); $("#docsInput").value = o.code; docsLookup(o.code); });
  });

  const docFile = (title, code, rows) => {
    const html = `<!doctype html><html lang="es"><meta charset="utf-8"><title>${esc(title)} · ${esc(code)}</title>
      <body style="font-family:Georgia,serif;max-width:720px;margin:48px auto;color:#1b2230">
      <p style="font:12px Arial;color:#a14b3c;letter-spacing:.1em">DOCUMENTO DE DEMOSTRACIÓN · SIN VALIDEZ · PROYECTO ACADÉMICO</p>
      <p style="letter-spacing:.3em;margin:0">ATLÁNTICA</p><h1 style="font-weight:normal;margin:.2em 0">${esc(title)}</h1>
      <p style="font:13px Arial;color:#6c6f78">Atlántica Conservas · Zona portuaria de Burela · 27880 Burela (Lugo)</p>
      <table style="width:100%;border-collapse:collapse;font:14px Arial">${rows.map(([k, v]) => `<tr><td style="border-bottom:1px solid #ddd;padding:8px;width:40%"><b>${esc(k)}</b></td><td style="border-bottom:1px solid #ddd;padding:8px">${esc(v)}</td></tr>`).join("")}</table>
      <p style="font:12px Arial;color:#6c6f78;margin-top:24px">Generado automáticamente el ${today()}.</p></body></html>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html" })); a.download = `${title.replace(/\s+/g, "-")}-${code}.html`;
    document.body.appendChild(a); a.click(); a.remove(); toast(`Descargado · ${title}`);
  };
  function docsLookup(raw) {
    const code = String(raw).trim().toUpperCase(), out = $("#docsResult"), o = orders()[code], lot = LOTS[code];
    if (o && o.type === "b2b") {
      const lots = o.lines.map((l) => lotOf(l.id));
      const docs = [
        { t: "Certificado sanitario", d: `Lotes ${lots.join(", ")}`, rows: [["Pedido", o.code], ["Cliente", o.name], ["Lotes", lots.join(", ")], ["Controles", "100 % de las latas revisadas antes del cierre · esterilización registrada"], ["Destino", o.pais]] },
        o.pais !== "España" ? { t: "Documentación de exportación", d: `Destino ${o.pais}`, rows: [["Pedido", o.code], ["Exportador", "Atlántica Conservas"], ["Importador", o.name], ["País", o.pais], ["Mercancía", o.lines.map((l) => `${l.qty} cajas · ${P[l.id].name}`).join("; ")]] } : null,
        { t: "Factura", d: `${o.lines.reduce((a, l) => a + l.qty, 0)} cajas`, rows: [["Pedido", o.code], ["Fecha", o.date], ["Cliente", o.name], ...o.lines.map((l) => [P[l.id].name, `${l.qty} cajas × ${eur(wholesale(P[l.id]))}`]), ["Total sin IVA", eur(o.lines.reduce((a, l) => a + l.qty * wholesale(P[l.id]), 0))]] },
      ].filter(Boolean);
      out.innerHTML = `<p class="docs__title">Pedido <b>${o.code}</b> · ${esc(o.name)}</p><div class="doclist">${docs.map((d, i) => `<div class="doc"><span class="doc__auto">GENERADO AUTOMÁTICAMENTE</span><b>${d.t}</b><small>${esc(d.d)}</small><button class="btn btn--line btn--sm" data-doc="${i}">Descargar</button></div>`).join("")}</div>`;
      $$("[data-doc]", out).forEach((b) => b.addEventListener("click", () => { const d = docs[+b.dataset.doc]; docFile(d.t, o.code, d.rows); }));
    } else if (lot) {
      const p = P[lot.product];
      out.innerHTML = `<p class="docs__title">Lote <b>${code}</b> · ${p.name}</p><div class="doclist"><div class="doc"><span class="doc__auto">GENERADO AUTOMÁTICAMENTE</span><b>Certificado sanitario del lote</b><small>Exportación y factura van con cada pedido.</small><button class="btn btn--line btn--sm" id="dlLot">Descargar</button></div></div>`;
      $("#dlLot").addEventListener("click", () => docFile("Certificado sanitario", code, [["Lote", code], ["Producto", p.full], ["Especie", lot.species], ["Zona", lot.zone], ["Lonja", lot.lonja], ["Envasado", lot.packed], ["Latas revisadas", num(lot.cans)], ["Esterilización", `mínimo ${lot.auto}`]]));
    } else {
      out.innerHTML = `<p class="docs__title">No encontramos documentación para <b>${esc(code || "—")}</b>. Usa un pedido profesional (PED-B2B-…) o un lote (AC-0000-X00).</p>`;
    }
  }
  $("#docsForm").addEventListener("submit", (e) => { e.preventDefault(); docsLookup($("#docsInput").value); });

  /* =========================================================
     ATENCIÓN AL CLIENTE
     ========================================================= */
  const SEED_ORDERS = {
    "PED-1042": { code: "PED-1042", type: "b2c", date: "02/11/2026", step: 2, name: "Cliente de ejemplo", lines: [{ id: "ventresca", qty: 2 }, { id: "pulpo", qty: 1 }], ship: 0, carrier: "Mensajería 24-48 h · entrega estimada 12/11/2026" },
    "PED-B2B-2207": { code: "PED-B2B-2207", type: "b2b", date: "06/11/2026", step: 2, name: "Feinkost Nordsee GmbH (ejemplo)", tipo: "Importador", pais: "Alemania", lines: [{ id: "bonito", qty: 10 }, { id: "ventresca", qty: 4 }], carrier: "Transporte refrigerado · Hamburgo" },
  };
  const SEED_CLAIMS = {
    "REC-0318": { code: "REC-0318", date: "24/10/2026", step: 2, lata: "AC-2610-S12-3071", motivo: "Lata golpeada o abollada", solucion: "Reposición del producto", resolution: "Revisada la lata y su lote: sin incidencias de producción. Golpe en el transporte; reposición enviada el 27/10/2026." },
  };
  const orders = () => ({ ...SEED_ORDERS, ...store.get("orders", {}) });
  const claims = () => ({ ...SEED_CLAIMS, ...store.get("claims", {}) });
  const saveOrder = (o) => { const a = store.get("orders", {}); a[o.code] = o; store.set("orders", a); };
  const saveClaim = (c) => { const a = store.get("claims", {}); a[c.code] = c; store.set("claims", a); };
  const timeline = (steps, cur, notes = {}) => `<ul class="timeline">${steps.map((s, i) => `<li class="${i < cur ? "" : i === cur ? "current" : "pending"}"><b>${s}</b>${notes[i] ? `<small>${notes[i]}</small>` : ""}</li>`).join("")}</ul>`;

  function trackLookup(raw) {
    const code = AC.parseCode(raw), out = $("#trackResult");
    $("#trackInput").value = code;
    const o = orders()[code], c = claims()[code], can = CANS[code];
    if (o) {
      const total = o.lines.reduce((a, x) => a + x.qty * (o.type === "b2b" ? wholesale(P[x.id]) : P[x.id].price), 0) + (o.ship || 0);
      out.innerHTML = `<div class="status"><div><span class="status__badge ${o.step >= 3 ? "done" : ""}">${["Recibido", "En preparación", "Enviado", "Entregado"][o.step]}</span>
        <h3>Pedido ${o.code}</h3><p class="muted" style="margin:.3rem 0 0">${o.date} · ${esc(o.name)}</p>
        <ul class="status__lines">${o.lines.map((x) => `<li><span>${x.qty} ${o.type === "b2b" ? "cajas ·" : "×"} ${P[x.id].name}</span></li>`).join("")}<li><b>Total${o.type === "b2b" ? " sin IVA" : ""}</b><b>${eur(total)}</b></li></ul></div>
        <div>${timeline(["Recibido", "En preparación", "Enviado", "Entregado"], o.step, { 0: o.date, 1: "Cada lata se asigna con su código único.", 2: o.step >= 2 ? o.carrier : "" })}</div></div>`;
    } else if (c) {
      out.innerHTML = `<div class="status"><div><span class="status__badge ${c.step >= 2 ? "done" : ""}">${["Recibida", "En revisión", "Resuelta"][c.step]}</span>
        <h3>Incidencia ${c.code}</h3><p class="muted" style="margin:.3rem 0 0">${c.date} · lata ${c.lata}</p>
        <ul class="status__lines"><li><span>Motivo</span><span>${esc(c.motivo)}</span></li><li><span>Preferencia</span><span>${esc(c.solucion)}</span></li></ul></div>
        <div>${timeline(["Recibida", "En revisión por calidad", "Resuelta"], c.step, { 0: c.date, 1: "Calidad revisa el historial de esa lata y de su lote.", 2: c.resolution || "" })}</div></div>`;
    } else if (can) {
      const p = canProduct(code), open = Object.values(claims()).filter((x) => x.lata === code && x.step < 2).length;
      out.innerHTML = `<div class="status"><div><span class="status__badge done">Lata auténtica</span><h3>${p.name}</h3><p class="muted" style="margin:.3rem 0 0">${code}</p>
        <ul class="status__lines"><li><span>Revisión antes del cierre</span><span>Superada</span></li><li><span>Incidencias abiertas</span><span>${open}</span></li><li><span>Consumo preferente</span><span>${LOTS[can.lot].best}</span></li></ul></div>
        <div><p style="margin-top:0" class="muted">Consulta su origen, la revisión que superó y cómo disfrutarla.</p><button class="btn btn--ink btn--sm" id="seeCan">Ver la ficha de la lata</button></div></div>`;
      $("#seeCan").addEventListener("click", () => verify(code));
    } else {
      out.innerHTML = `<p class="hint">No encontramos <b>${esc(code || "—")}</b>. Revisa el número (PED-…, REC-… o el código de la lata).</p>`;
    }
  }
  $("#trackForm").addEventListener("submit", (e) => { e.preventDefault(); trackLookup($("#trackInput").value); });

  $("#claimPhoto").addEventListener("change", (e) => { $("#claimPhotoName").textContent = e.target.files[0] ? e.target.files[0].name : "Añadir fotografía"; });
  const claimCan = $("#claimCan");
  claimCan.addEventListener("input", () => claimCan.setCustomValidity(""));
  $("#claimForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target), lata = AC.parseCode(f.get("lata"));
    if (!CANS[lata]) { claimCan.setCustomValidity("No encontramos esa lata. Revisa el código grabado junto al QR."); claimCan.reportValidity(); return; }
    const all = claims();
    const c = { code: newCode("REC", (x) => all[x]), date: today(), step: 0, lata, email: f.get("email"), motivo: f.get("motivo"), solucion: f.get("solucion") };
    saveClaim(c); e.target.reset(); $("#claimPhotoName").textContent = "Añadir fotografía";
    openModal(`<div class="seal">✓</div><h3>Incidencia registrada</h3><p class="code">${c.code}</p>
      <p>Nuestro equipo de calidad revisará el historial de la lata <b>${lata}</b> y te escribirá a ${esc(c.email)}.</p>
      <button class="btn btn--ink" data-close id="seeClaim">Ver el estado</button>`);
    $("#seeClaim").addEventListener("click", () => { showCare("careTrack"); trackLookup(c.code); });
  });

  const rating = {};
  $$(".stars").forEach((box) => {
    box.innerHTML = [1, 2, 3, 4, 5].map((n) => `<button type="button" data-v="${n}" aria-label="${n} de 5">★</button>`).join("");
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-v]"); if (!b) return;
      rating[box.dataset.name] = +b.dataset.v; $$("button", box).forEach((x) => x.classList.toggle("on", +x.dataset.v <= +b.dataset.v));
    });
  });
  $("#surveyForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!rating.producto || !rating.servicio) { toast("Puntúa el producto y la compra con las estrellas."); return; }
    const f = new FormData(e.target), a = store.get("surveys", []);
    a.push({ date: today(), ...rating, qr: f.get("qr"), mejora: f.get("mejora") }); store.set("surveys", a);
    e.target.reset(); Object.keys(rating).forEach((k) => delete rating[k]); $$(".stars button").forEach((b) => b.classList.remove("on"));
    openModal(`<div class="seal">♥</div><h3>Gracias por tu opinión</h3><p>Leemos cada respuesta. Nos ayuda a mejorar cada campaña.</p><button class="btn btn--ink" data-close>Cerrar</button>`);
  });

  /* ---------- Contacto (n8n) y créditos ---------- */
  $("#contactBtn").addEventListener("click", () => {
    if (CONFIG.n8nFormUrl) { window.open(CONFIG.n8nFormUrl, "_blank", "noopener"); return; }
    openModal(`<h3>Formulario de contacto</h3><p>Aquí se abrirá nuestro formulario. Al enviarlo recibirás una respuesta por correo con un enlace para reservar una llamada.</p>
      <p class="hint">Pendiente de conectar con el workflow de n8n: pega su URL en <code>CONFIG.n8nFormUrl</code>, en <code>shared.js</code>.</p>
      <button class="btn btn--ink" data-close>Entendido</button>`);
  });
  $("#creditsBtn").addEventListener("click", () => openModal(`<h3>Créditos de las fotografías</h3>
    <p>Fotografías de Wikimedia Commons, usadas según sus licencias.</p>
    <ul class="credits">${PHOTO_CREDITS.map(([t, a, l, u]) => `<li>«${esc(t)}» · ${esc(a)} · <a href="${u}" target="_blank" rel="noopener">${l}</a></li>`).join("")}</ul>`));
})();
