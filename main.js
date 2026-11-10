/* ============================================================
   Dolci Barby - script principale
   ============================================================ */

// Numero WhatsApp (formato internazionale senza spazi)
const WA_NUMBER = "393408396496";
const PHONE_DISPLAY = "340 8396496";

// Costruisce link WhatsApp con testo precompilato
function waLink(text) {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${WA_NUMBER}?text=${encoded}`;
}

// Apre WhatsApp con messaggio
function openWhatsApp(text) {
  window.open(waLink(text), "_blank", "noopener");
}

// Menu mobile
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));
  }

  // Evidenzia pagina attiva
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === current) a.classList.add("active");
  });
});

// --- Pagina Richieste: gestione form ---
function buildRequestMessage(data) {
  const lines = [];
  lines.push("🍰 *Nuova richiesta dal sito*");
  lines.push("");
  lines.push(`👤 Nome: ${data.nome}`);
  if (data.telefono) lines.push(`📞 Telefono: ${data.telefono}`);
  if (data.email) lines.push(`✉️ Email: ${data.email}`);
  lines.push(`🎉 Tipo richiesta: ${data.tipo}`);
  if (data.occasione) lines.push(`📅 Occasione: ${data.occasione}`);
  if (data.data) lines.push(`🗓 Data desiderata: ${data.data}`);
  if (data.persone) lines.push(`👥 Persone: ${data.persone}`);
  if (data.gusto) lines.push(`🍫 Gusto / farcitura: ${data.gusto}`);
  if (data.budget) lines.push(`💰 Budget indicativo: ${data.budget}`);
  if (data.foto) lines.push(`📎 Foto selezionata: ${data.foto} (da allegare su WhatsApp)`);
  lines.push("");
  lines.push("📝 Dettagli:");
  lines.push(data.dettagli || "(nessun dettaglio)");
  lines.push("");
  lines.push("Inviato dal sito web. Grazie! 🌸");
  return lines.join("\n");
}

function handleRequestForm(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    nome: form.nome.value.trim(),
    telefono: form.telefono.value.trim(),
    email: form.email.value.trim(),
    tipo: form.tipo.value,
    occasione: form.occasione.value.trim(),
    data: form.data.value,
    persone: form.persone.value.trim(),
    gusto: form.gusto.value.trim(),
    budget: form.budget.value.trim(),
    dettagli: form.dettagli.value.trim(),
    foto: form.foto && form.foto.files && form.foto.files[0] ? form.foto.files[0].name : "",
  };
  if (!data.nome || !data.tipo) {
    alert("Per favore compila almeno il nome e il tipo di richiesta.");
    return;
  }
  const msg = buildRequestMessage(data);
  // Aggiorna anteprima
  const preview = document.getElementById("wa-preview-text");
  if (preview) preview.textContent = msg;
  // Apri WhatsApp
  openWhatsApp(msg);
}

// Inizializza form se presente
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("request-form");
  if (form) form.addEventListener("submit", handleRequestForm);

  // Mostra campo foto solo per cialda in ostia
  const tipo = document.getElementById("tipo");
  const fileField = document.getElementById("file-field");
  if (tipo && fileField) {
    const toggle = () => {
      fileField.style.display = (tipo.value === "Cialda in ostia personalizzata") ? "" : "none";
    };
    tipo.addEventListener("change", toggle);
    toggle();
  }
});

// --- Cookie banner ---
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("cookieConsent") === "accepted") return;
  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.id = "cookie-banner";
  banner.innerHTML = `<span>Questo sito utilizza cookie tecnici. Continuando la navigazione accetti l'uso dei cookie. <a href="privacy.html">Privacy</a></span><button type="button" id="cookie-accept">Accetta</button>`;
  document.body.appendChild(banner);
  const btn = document.getElementById("cookie-accept");
  if (btn) btn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    banner.remove();
  });
});
