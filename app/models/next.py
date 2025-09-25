from enum import Enum

from pydantic import BaseModel, Field


class ActionEnum(str, Enum):
    CASE_CLOSED = "case_closed"
    COMMERCIAL_OFFER = "commercial_offer"
    CUSTOMER_WILL_SEND_INFO = "customer_will_send_info"
    HIGH_PRIORITY = "high_priority"
    PROPOSE_NEW_CONTRACT = "propose_new_contract"
    REQUIRES_EXPERTISE = "requires_expertise"


class NextModel(BaseModel):
    action: ActionEnum = Field(
        description="Maßnahme, die nach dem Gespräch basierend auf dem Gesprächsverlauf für das Unternehmen ergriffen werden soll."
    )
    justification: str = Field(
        description="""
        Begründung für die gewählte Maßnahme.

        # Regeln
        - Nicht mehr als ein paar Sätze

       # Beispiele für Antworten
        - "Der Kunde hat die offene Forderung vollständig beglichen. Der Fall kann abgeschlossen werden."
        - "Der Kunde ist mit der vorgeschlagenen Ratenzahlung einverstanden. Vereinbarung wurde bestätigt. Fall kann abgeschlossen werden."
        - "Dem Kunden fehlen noch Unterlagen zum Parkverstoß (z. B. Zahlungsbeleg). Er wird diese bis Freitag per E-Mail zusenden."
        - "Der Kunde ist mit der Höhe der Rate nicht einverstanden und möchte mit einem Vorgesetzten sprechen. Vorgang hat hohe Priorität."
        - "Der Kunde möchte eine neue Zahlungsvereinbarung mit geänderter Ratenhöhe abschließen. Neuer Vertrag muss vorbereitet werden."
        - "Der Kunde bestreitet die Forderung und benötigt eine rechtliche Prüfung des Vorgangs. Ein Experte soll den Fall übernehmen."
        """
    )
