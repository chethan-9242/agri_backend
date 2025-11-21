from datetime import datetime
from typing import List

from ..models.alerts import Alert, AlertType

_alerts: dict[int, Alert] = {}
_next_alert_id = 1


def create_alert(user_id: int, message: str, alert_type: AlertType, batch_id: int | None = None) -> Alert:
    global _next_alert_id
    alert_id = _next_alert_id
    _next_alert_id += 1

    alert = Alert(
        id=alert_id,
        user_id=user_id,
        batch_id=batch_id,
        type=alert_type,
        message=message,
        created_at=datetime.utcnow(),
        is_read=False,
    )
    _alerts[alert_id] = alert
    return alert


def list_alerts_for_user(user_id: int) -> List[Alert]:
    return [a for a in _alerts.values() if a.user_id == user_id]
