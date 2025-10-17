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


function renderClaims() {
  const container = document.getElementById("claims-list");
  const claims = JSON.parse(localStorage.getItem("claims") || JSON.stringify(defaultPayload.claim));

  if (!claims.length) {
    container.innerHTML = "<p>Keine Felder definiert.</p>";
    return;
  }

  container.innerHTML = claims
    .map((claim, idx) => `
      <label>
        <input type="checkbox" class="claim-checkbox" data-index="${idx}" checked>
        ${claim.description} <small style="color:gray;">(${claim.name}, ${claim.type})</small>
      </label>
    `).join("");
}

renderClaims();

const form = document.getElementById("f");
const phoneInput = document.getElementById("phone");
const taskInput = document.getElementById("task");
const prosodyRateInput = document.getElementById("prosody_rate");
const voiceSelect = document.getElementById("voiceSelect");
const out = document.getElementById("out");
const btn = document.getElementById("btn");

document.getElementById('add-claim').onclick = () => {
  const d = document.getElementById('new-claim-description').value.trim();
  const n = (document.getElementById('new-claim-name').value.trim() || d.toLowerCase().replace(/\s+/g,'_'));
  const t = document.getElementById('new-claim-type').value;
  if (!d) return alert('Beschreibung fehlt.');
  const arr = JSON.parse(localStorage.getItem('claims') || '[]');
  arr.push({ description: d, name: n, type: t });
  localStorage.setItem('claims', JSON.stringify(arr));
  document.getElementById('new-claim-description').value = '';
  document.getElementById('new-claim-name').value = '';
  document.getElementById('new-claim-type').value = 'text';
  renderClaims();
};
document.getElementById("select-all")?.addEventListener("click", () => {
  document.querySelectorAll(".claim-checkbox").forEach(cb => cb.checked = true);
});

document.getElementById("deselect-all")?.addEventListener("click", () => {
  document.querySelectorAll(".claim-checkbox").forEach(cb => cb.checked = false);
});

document.getElementById("reset-claims")?.addEventListener("click", () => {
  localStorage.removeItem("claims");
  renderClaims();
});



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

  const allClaims = JSON.parse(localStorage.getItem("claims") || JSON.stringify(defaultPayload.claim));

  const selectedClaimIndexes = Array.from(document.querySelectorAll(".claim-checkbox"))
    .map((cb, idx) => cb.checked ? idx : -1)
    .filter(idx => idx !== -1);

  const selectedClaims = selectedClaimIndexes.map(i => allClaims[i]);

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
