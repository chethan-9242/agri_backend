from typing import List

from fastapi import APIRouter, Depends

from ..models.chat import ChatMessage, ChatMessageCreate
from ..models.user import User
from ..security import get_current_user
from ..repositories.chat import send_message, get_conversation

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/messages", response_model=ChatMessage)
def send(
    msg_in: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
):
    return send_message(current_user.id, msg_in)


@router.get("/conversations/{other_user_id}", response_model=List[ChatMessage])
def conversation(
    other_user_id: int,
    current_user: User = Depends(get_current_user),
):
    return get_conversation(current_user.id, other_user_id)
