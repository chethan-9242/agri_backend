from datetime import datetime
from pydantic import BaseModel


class ChatMessageCreate(BaseModel):
    to_user_id: int
    content: str


class ChatMessage(BaseModel):
    id: int
    from_user_id: int
    to_user_id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
