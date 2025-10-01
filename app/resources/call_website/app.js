const defaultPayload = {
  bot_company: "Mindfields AG",
  bot_name: "Florian",
  phone_number: "+49777888777",
  task: "General task",
  agent_phone_number: "+18882818144",
  lang: { default_short_code: "de-DE", availables: [{ pronunciations_en: ["German","DE","Germany"], short_code: "de-DE", voice: "de-DE-FlorianMultilingualNeural" }] },
  claim: [
    { name: "vorname", type: "text" }, { name: "nachname", type: "text" }, { name: "kennzeichen", type: "text" },
    { name: "aktenzeichen", type: "text" }, { name: "alternative_telefonnummer", type: "phone_number" },
    { name: "direkt_zahlung", type: "text" }, { name: "ratenzahlung", type: "text" },
    { name: "ratenhoehe", type: "text" }, { name: "zahlungsbeginn", type: "datetime" }
  ]
};

const form = document.getElementById("f");
const phoneInput = document.getElementById("phone");
const out = document.getElementById("out");
const btn = document.getElementById("btn");

function buildPayload(phone) { return { ...defaultPayload, phone_number: phone }; }

async function postCall(payload) {
  const res = await fetch("/call", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = phoneInput.value.trim();
  if (!phone) return;
  btn.disabled = true; out.textContent = "Sende Anfrage ...";
  try {
    const payload = buildPayload(phone);
    const res = await postCall(payload);
    out.textContent = (res.ok ? "" : "Fehler ") + "(" + res.status + "):\n" + JSON.stringify(res.data, null, 2);
  } catch (err) {
    out.textContent = "Fehler: " + (err?.message || err);
  } finally {
    btn.disabled = false;
  }
});
