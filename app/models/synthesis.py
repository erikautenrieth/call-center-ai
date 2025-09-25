from enum import Enum

from pydantic import BaseModel, Field


class SatisfactionEnum(str, Enum):
    TERRIBLE = "terrible"
    """Die Zufriedenheit ist sehr niedrig (1/4)."""
    LOW = "low"
    """Die Zufriedenheit ist niedrig (2/4)."""
    PARTIAL = "partial"
    """Die Zufriedenheit ist teilweise gegeben (3/4)."""
    HIGH = "high"
    """Die Zufriedenheit ist hoch (4/4)."""
    UNKNOW = "unknow"


class SynthesisModel(BaseModel):
    long: str = Field(
        description="""
        Fassen Sie das Gespräch mit dem Kunden in einem Absatz zusammen.
        Der Kunde kann auf diese Nachricht nicht antworten, wird sie aber in seinem Web-Portal lesen.

        # Regeln
        - Keine Details zum Ablauf des Gesprächs angeben
        - Keine persönlichen Daten angeben (z. B. Name, Telefonnummer, Adresse)
        - Informationen aus dem Gespräch einbeziehen, um dem Kunden zu zeigen, dass die Situation verstanden wurde
        - Bevorzugt Details zur Situation angeben (z. B. was, wann, wo, wie)
        - Verwenden Sie "Sie", um den Kunden anzusprechen, und "ich", um den Assistenten zu benennen
        - Verwenden Sie Markdown-Syntax, um die Nachricht mit Absätzen, **Fettschrift** und URL zu formatieren
        """
    )
    satisfaction: SatisfactionEnum = Field(
        description="How satisfied is the customer with the call."
    )
    short: str = Field(
        description="""
        Fassen Sie das Gespräch mit dem Kunden in wenigen Worten zusammen.
        Der Kunde kann auf diese Nachricht nicht antworten, wird sie aber in seinem Web-Portal lesen.

        # Regeln
        - Beginnen Sie die Antwort mit einem Artikel (z. B. "die Bestellung der Ware", "Abonnement aufgegeben")

        # Beispiele für Antworten
        - "die offene Forderung der PARKcontrol24"
        - "die Vereinbarung zur Ratenzahlung"
        - "die Zahlung Ihres Parkverstoßes"
        - "der Ausgleich Ihrer offenen Rechnung"
        - "die Klärung Ihres Inkassofalls"
        - "die Mahnung zu Ihrem Aktenzeichen"
        - "die Begleichung Ihrer Außenstände"
        """
    )
    improvement_suggestions: str = Field(
        description="""
        Geben Sie Vorschläge zur Verbesserung des Kundenerlebnisses während des Gesprächs.

        # Regeln
        - Vorschläge zur Verbesserung des Gesprächsablaufs, des Verhaltens des Assistenten oder des Services des Unternehmens einbeziehen
        - Nicht mehr als ein paar Sätze
        """
    )
