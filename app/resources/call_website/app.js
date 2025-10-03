const defaultPayload = {
  bot_company: "Mindfields AG",
  bot_name: "Florian",
  phone_number: "+49777888777",
  task: "Call the debtor proactively and make it clear that there is an outstanding claim from PARKcontrol24. Identify the customer unambiguously (license plate or case number as well as first and last name), briefly explain the origin of the claim and offer a solution: lump-sum payment or standardized installment plan. Record all data for a binding agreement (installment amount, payment start date) and store it continuously. Remain friendly, professional, and solution-oriented.",
  agent_phone_number: "+18882818144",
  lang: {
    default_short_code: "de-DE",
    availables: [{ pronunciations_en: ["German","DE","Germany"], short_code: "de-DE", voice: "de-DE-FlorianMultilingualNeural" }]
  },
  claim: [
    { name: "vorname", type: "text" }, { name: "nachname", type: "text" }, { name: "kennzeichen", type: "text" },
    { name: "aktenzeichen", type: "text" }, { name: "alternative_telefonnummer", type: "phone_number" },
    { name: "direkt_zahlung", type: "text" }, { name: "ratenzahlung", type: "text" },
    { name: "ratenhoehe", type: "text" }, { name: "zahlungsbeginn", type: "datetime" }
  ]
};

const form = document.getElementById("f");
const phoneInput = document.getElementById("phone");
const taskInput = document.getElementById("task");
const out = document.getElementById("out");
const btn = document.getElementById("btn");

function buildPayload(overrides = {}) {
  return { ...defaultPayload, ...overrides };
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

  if (!phone) return;

  btn.disabled = true;
  out.textContent = "Sende Anfrage ...";

  try {
    const payload = buildPayload({
      phone_number: phone,
       task: String(task || defaultPayload.task)
    });

    const res = await postCall(payload);
    out.textContent = (res.ok ? "" : "Fehler ") + "(" + res.status + "):\n" + JSON.stringify(res.data, null, 2);
  } catch (err) {
    out.textContent = "Fehler: " + (err?.message || err);
  } finally {
    btn.disabled = false;
  }
});
