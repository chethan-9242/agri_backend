from __future__ import annotations

from typing import Literal, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from ..models.user import User, UserRole
from ..security import get_current_user
from ..rag.graph_rag import answer_with_graph_rag


router = APIRouter(prefix="/ai", tags=["ai"])


class FarmerQuestion(BaseModel):
    question: str
    # Optional explicit use-case label if frontend wants to categorize
    use_case: Optional[
        Literal[
            "disease_diagnosis",
            "pest_control",
            "fertilizer_guidance",
            "weather_risk",
            "storage",
            "yield_improvement",
            "organic_vs_chemical",
            "soil_health",
        ]
    ] = None


class DistributorQuestion(BaseModel):
    question: str
    use_case: Optional[Literal["best_transport", "spoilage_reduction"]] = None


class AIAnswer(BaseModel):
    answer: str


@router.post("/farmer", response_model=AIAnswer)
async def ask_farmer_ai(
    body: FarmerQuestion,
    current_user: User = Depends(get_current_user),
):
    # Enforce farmer role for this endpoint
    if current_user.role != UserRole.FARMER:
        # We reuse role-based error semantics from security.require_role but inline to keep dep simple
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only farmers can use this endpoint")

    answer = answer_with_graph_rag(
        question=body.question,
        role="farmer",
        use_case=body.use_case,
    )
    return AIAnswer(answer=answer)


@router.post("/distributor", response_model=AIAnswer)
async def ask_distributor_ai(
    body: DistributorQuestion,
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.DISTRIBUTOR:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only distributors can use this endpoint")

    # Restrict to the two allowed distributor use-cases implied by requirements
    answer = answer_with_graph_rag(
        question=body.question,
        role="distributor",
        use_case=body.use_case,
    )
    return AIAnswer(answer=answer)
