const defaultPayload = {
  bot_company: "Mindfields AG",
  bot_name: "Florian",
  phone_number: "+49777888777",
  task: "Call the debtor proactively and make it clear that there is an outstanding claim from PARKcontrol24. Identify the customer unambiguously (license plate or case number as well as first and last name), briefly explain the origin of the claim and offer a solution: lump-sum payment or standardized installment plan. Record all data for a binding agreement (installment amount, payment start date) and store it continuously. Remain friendly, professional, and solution-oriented.",
  agent_phone_number: "+18882818144",
  prosody_rate: 1.00,
  lang: {
    default_short_code: "de-DE",
    availables: [
      {
        pronunciations_en: ["German", "DE", "Germany"],
        short_code: "de-DE",
        voice: "de-DE-FlorianMultilingualNeural"
      }
    ]
  },
  claim: [
    { description: "Vorname des Schuldners", name: "vorname", type: "text" },
    { description: "Nachname des Schuldners", name: "nachname", type: "text" },
    { description: "Kennzeichen des Fahrzeugs", name: "kennzeichen", type: "text" },
    { description: "Aktenzeichen oder Referenznummer der Forderung", name: "aktenzeichen", type: "text" },
    { description: "Alternative Telefonnummer für Rückfragen", name: "alternative_telefonnummer", type: "phone_number" },
    { description: "Direktzahlung vereinbart? (Ja/Nein)", name: "direkt_zahlung", type: "text" },
    { description: "Ratenzahlung vereinbart? (Ja/Nein)", name: "ratenzahlung", type: "text" },
    { description: "Höhe der Raten bei Ratenzahlung", name: "ratenhoehe", type: "text" },
    { description: "Datum des Beginns der Zahlung oder ersten Rate", name: "zahlungsbeginn", type: "datetime" }
  ]
};

const form = document.getElementById("f");
const phoneInput = document.getElementById("phone");
const taskInput = document.getElementById("task");
const prosodyRateInput = document.getElementById("prosody_rate");
const voiceSelect = document.getElementById("voiceSelect");
const out = document.getElementById("out");
const btn = document.getElementById("btn");

// Claim-Management
const claimFieldsContainer = document.getElementById("claim-fields");
const newDescInput = document.getElementById("new-claim-description");
const newNameInput = document.getElementById("new-claim-name");
const newTypeSelect = document.getElementById("new-claim-type");
const addClaimBtn = document.getElementById("add-claim");
const selectAllBtn = document.getElementById("select-all");
const deselectAllBtn = document.getElementById("deselect-all");
const resetClaimsBtn = document.getElementById("reset-claims");

const ALLOWED_TYPES = ["text", "phone_number", "datetime"];

function genId() {
  return "c_" + Math.random().toString(36).slice(2);
}
function normalizeName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function loadClaims() {
  const saved = localStorage.getItem("claims");
  if (saved) {
    try {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr)) {
        return arr.map(c => ({ ...c, selected: c.selected !== false, id: c.id || genId() }));
      }
    } catch {}
  }
  // Standard aus defaultPayload übernehmen und standardmäßig auswählen
  return defaultPayload.claim.map(c => ({ ...c, selected: true, id: genId() }));
}
function saveClaims() {
  localStorage.setItem("claims", JSON.stringify(claims));
}

let claims = loadClaims();

function renderClaims() {
  claimFieldsContainer.innerHTML = "";
  if (!claims.length) {
    claimFieldsContainer.textContent = "Keine Felder vorhanden.";
    return;
  }
  claims.forEach(c => {
    const row = document.createElement("div");
    row.className = "claim-row";
    row.style = "display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.25rem 0";
    row.innerHTML = `
      <label style="flex:1">
        <input type="checkbox" data-id="${c.id}" ${c.selected ? "checked" : ""}>
        <strong>${escapeHtml(c.description)}</strong>
        <small style="display:block;color:#666">name: ${escapeHtml(c.name)} · typ: ${escapeHtml(c.type)}</small>
      </label>
      <button type="button" data-delete="${c.id}" aria-label="Feld entfernen" style="background:transparent;border:none;cursor:pointer">🗑️</button>
    `;
    claimFieldsContainer.appendChild(row);
  });
}

claimFieldsContainer.addEventListener("change", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;
  const claim = claims.find(c => c.id === id);
  if (claim) {
    claim.selected = e.target.checked;
    saveClaims();
  }
});

claimFieldsContainer.addEventListener("click", (e) => {
  const id = e.target.dataset.delete;
  if (!id) return;
  claims = claims.filter(c => c.id !== id);
  saveClaims();
  renderClaims();
});

addClaimBtn?.addEventListener("click", () => {
  const description = newDescInput.value.trim();
  let name = normalizeName(newNameInput.value || description);
  const type = newTypeSelect.value;

  if (!description) {
    alert("Bitte eine Beschreibung eingeben.");
    return;
  }
  if (!name) {
    alert("Bitte einen technischen Namen eingeben.");
    return;
  }
  if (!ALLOWED_TYPES.includes(type)) {
    alert("Ungültiger Typ.");
    return;
  }
  if (claims.some(c => c.name === name)) {
    alert("Der Name ist bereits vorhanden. Bitte einen eindeutigen Namen wählen.");
    return;
  }

  const newClaim = { id: genId(), description, name, type, selected: true };
  claims.push(newClaim);
  saveClaims();
  renderClaims();

  newDescInput.value = "";
  newNameInput.value = "";
  newTypeSelect.value = "text";
});

selectAllBtn?.addEventListener("click", () => {
  claims.forEach(c => c.selected = true);
  saveClaims();
  renderClaims();
});

deselectAllBtn?.addEventListener("click", () => {
  claims.forEach(c => c.selected = false);
  saveClaims();
  renderClaims();
});

resetClaimsBtn?.addEventListener("click", () => {
  if (!confirm("Standardfelder wiederherstellen? Eigene Felder gehen dabei verloren.")) return;
  claims = defaultPayload.claim.map(c => ({ ...c, selected: true, id: genId() }));
  saveClaims();
  renderClaims();
});

// Initial render
renderClaims();
// Ende Claim-Management

function buildPayload(overrides = {}) {
  const selectedVoice = voiceSelect.value || "de-DE-FlorianMultilingualNeural";
  const selectedVoiceName = voiceSelect.options[voiceSelect.selectedIndex].text.trim() || "Florian";
  const langShortCode = selectedVoice.split("-").slice(0, 2).join("-");

  return {
    ...defaultPayload,
    ...overrides,
    bot_name: selectedVoiceName,
    lang: {
      default_short_code: langShortCode,
      availables: [
        {
          pronunciations_en: ["German", "DE", "Germany"],
          short_code: langShortCode,
          voice: selectedVoice
        }
      ]
    },
  };
}


async function postCall(payload) {
  const res = await fetch("/call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const phone = phoneInput.value.trim();
  const task = (taskInput?.value || "").trim();
  const prosodyRate = Math.max(0.75, Math.min(prosodyRateInput.value, 1.25));
  const selectedClaims = claims
      .filter(c => c.selected)
      .map(({ description, name, type }) => ({ description, name, type }));

  if (!phone) return;

  btn.disabled = true;
  out.textContent = "Sende Anfrage ...";

  try {
    const payload = buildPayload({
      phone_number: phone,
      task: task || defaultPayload.task,
      prosody_rate: prosodyRate,
      claim: selectedClaims
    });

    const res = await postCall(payload);
    out.textContent = (res.ok ? "" : "Fehler ") + "(" + res.status + "):\n" + JSON.stringify(res.data, null, 2);
  } catch (err) {
    out.textContent = "Fehler: " + (err?.message || err);
  } finally {
    btn.disabled = false;
  }
});
