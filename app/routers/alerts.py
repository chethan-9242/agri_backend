from typing import List

from fastapi import APIRouter, Depends

from ..models.alerts import Alert
from ..repositories.alerts import list_alerts_for_user
from ..models.user import User
from ..security import get_current_user

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/", response_model=List[Alert])
def my_alerts(current_user: User = Depends(get_current_user)):
    return list_alerts_for_user(current_user.id)
