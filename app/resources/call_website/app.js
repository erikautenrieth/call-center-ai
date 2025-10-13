const defaultPayload = {
  bot_company: "Mindfields AG",
  bot_name: "Florian",
  phone_number: "+49777888777",
  task: "Call the debtor proactively and make it clear that there is an outstanding claim from PARKcontrol24. Identify the customer unambiguously (license plate or case number as well as first and last name), briefly explain the origin of the claim and offer a solution: lump-sum payment or standardized installment plan. Record all data for a binding agreement (installment amount, payment start date) and store it continuously. Remain friendly, professional, and solution-oriented.",
  agent_phone_number: "+18882818144",
  prosody_rate: 1.00,
  lang: {
    default_short_code: "de-DE",
    availables: [{ pronunciations_en: ["German","DE","Germany"], short_code: "de-DE", voice: "de-DE-FlorianMultilingualNeural" }]
  },
  claim: [
    {
      "description": "Vorname des Schuldners",
      "name": "vorname",
      "type": "text"
    },
    {
      "description": "Nachname des Schuldners",
      "name": "nachname",
      "type": "text"
    },
    {
      "description": "Kennzeichen des Fahrzeugs",
      "name": "kennzeichen",
      "type": "text"
    },
    {
      "description": "Aktenzeichen oder Referenznummer der Forderung",
      "name": "aktenzeichen",
      "type": "text"
    },
    {
      "description": "Alternative Telefonnummer für Rückfragen",
      "name": "alternative_telefonnummer",
      "type": "phone_number"
    },
    {
      "description": "Direktzahlung vereinbart? (Ja/Nein)",
      "name": "direkt_zahlung",
      "type": "text"
    },
    {
      "description": "Ratenzahlung vereinbart? (Ja/Nein)",
      "name": "ratenzahlung",
      "type": "text"
    },
    {
      "description": "Höhe der Raten bei Ratenzahlung",
      "name": "ratenhoehe",
      "type": "text"
    },
    {
      "description": "Datum des Beginns der Zahlung oder ersten Rate",
      "name": "zahlungsbeginn",
      "type": "datetime"
    }
  ],
};

const form = document.getElementById("f");
const phoneInput = document.getElementById("phone");
const taskInput = document.getElementById("task");
const prosodyRateInput = document.getElementById("prosody_rate");
const voiceSelect = document.getElementById("voiceSelect");
const out = document.getElementById("out");
const btn = document.getElementById("btn");

const ratenzahlungInput = document.getElementById("ratenzahlung");
const ratenhoeheInput = document.getElementById("ratenhoehe");

function buildPayload(overrides = {}, claimValues = {}) {
  const selectedVoice = voiceSelect.value || "de-DE-FlorianMultilingualNeural";
  const selectedVoiceName = voiceSelect.options[voiceSelect.selectedIndex].text.trim() || "Florian";

  return {
    initiate: {
      ...defaultPayload,
      ...overrides,
      bot_name: selectedVoiceName,
      lang: {
        default_short_code: selectedVoice.split("-").slice(0, 2).join("-"),
        availables: [{
          pronunciations_en: ["German", "DE", "Germany"],
          short_code: selectedVoice.split("-").slice(0, 2).join("-"),
          voice: selectedVoice
        }]
      }
    },
    claim: claimValues
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
  const ratenzahlung = (ratenzahlungInput?.value || "").trim();
  const ratenhoehe = (ratenhoeheInput?.value || "").trim();
  const claimValues = {
    vorname: "Max",
    nachname: "Müller",
    ratenzahlung,
    ratenhoehe
  };


  if (!phone) return;

  btn.disabled = true;
  out.textContent = "Sende Anfrage ...";

  try {
    const payload = buildPayload({
    phone_number: phone,
    task: task || defaultPayload.task,
    prosody_rate: prosodyRate
  }, claimValues);

    const res = await postCall(payload);
    out.textContent = (res.ok ? "" : "Fehler ") + "(" + res.status + "):\n" + JSON.stringify(res.data, null, 2);
  } catch (err) {
    out.textContent = "Fehler: " + (err?.message || err);
  } finally {
    btn.disabled = false;
  }
});
