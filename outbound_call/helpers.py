import json
from pathlib import Path
import requests

def load_json(path: str) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))

def validate_payload(payload: dict) -> None:
    if not payload.get("phone_number", "").startswith("+"):
        print("⚠️ Hinweis: phone_number sollte im E.164-Format sein (z. B. +491234567890).")
    if not payload.get("task"):
        print("⚠️ Hinweis: task ist leer.")

def post_json(api_url: str, payload: dict, timeout: int = 30) -> requests.Response | None:
    headers = {"Content-Type": "application/json"}
    try:
        return requests.post(api_url, headers=headers, json=payload, timeout=timeout)
    except requests.RequestException as e:
        print(f"❌ Netzwerk-/Timeout-Fehler: {e}")
        return None

def format_response(response: requests.Response) -> str:
    if response is None:
        return "Keine Antwort (Request fehlgeschlagen)."
    try:
        return json.dumps(response.json(), indent=2, ensure_ascii=False)
    except json.JSONDecodeError:
        return response.text

def handle_response(response: requests.Response | None, success_codes: tuple[int, ...] = (200, 201)) -> bool:
    """
    Druckt Status und formatiert die Antwort. Gibt True zurück, wenn Status in success_codes, sonst False.
    """
    if response is None:
        print("❌ Request fehlgeschlagen. Keine Antwort erhalten.")
        return False

    print(f"HTTP {response.status_code}")
    if response.status_code in success_codes:
        print("✅ Call initiated successfully.")
        print("📦 Response:\n", format_response(response))
        return True
    else:
        print(f"❌ Failed to initiate call. Status code: {response.status_code}")
        print("Response:", format_response(response))
        return False
