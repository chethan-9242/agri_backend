from datetime import datetime
from typing import List

from ..models.chat import ChatMessage, ChatMessageCreate

_messages: dict[int, ChatMessage] = {}
_next_message_id = 1


def send_message(from_user_id: int, msg_in: ChatMessageCreate) -> ChatMessage:
    global _next_message_id
    msg_id = _next_message_id
    _next_message_id += 1

    message = ChatMessage(
        id=msg_id,
        from_user_id=from_user_id,
        to_user_id=msg_in.to_user_id,
        content=msg_in.content,
        created_at=datetime.utcnow(),
    )
    _messages[msg_id] = message
    return message


def get_conversation(user_id: int, other_user_id: int) -> List[ChatMessage]:
    return [
        m
        for m in _messages.values()
        if (m.from_user_id == user_id and m.to_user_id == other_user_id)
        or (m.from_user_id == other_user_id and m.to_user_id == user_id)
    ]
