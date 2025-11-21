from __future__ import annotations

import json
from datetime import datetime, date
from pathlib import Path
from typing import Any

from web3 import Web3
from web3.middleware.proof_of_authority import ExtraDataToPOAMiddleware

from .config import settings


# --- Lazy / safe web3 setup -------------------------------------------------

ABI_PATH = Path(__file__).resolve().parent / "agrichain_abi.json"


def _load_abi() -> list[dict[str, Any]]:
    try:
        return json.loads(ABI_PATH.read_text())
    except FileNotFoundError:
        print("[BC] ABI file not found at", ABI_PATH)
        return []


def _get_client_and_contract():
    """Return (web3, contract) or (None, None) if config is missing.

    We intentionally fail soft during hackathon so core app keeps working even
    if blockchain config is not set up yet.
    """

    if not (settings.__dict__.get("polygon_rpc_url") and settings.__dict__.get("polygon_private_key") and settings.__dict__.get("agrichain_contract_address")):
        print("[BC] Polygon config missing, skipping on-chain writes.")
        return None, None

    w3 = Web3(Web3.HTTPProvider(settings.polygon_rpc_url))
    # Polygon PoS / Amoy testnet uses PoA style headers
    w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

    abi = _load_abi()
    if not abi:
        return None, None

    contract = w3.eth.contract(
        address=Web3.to_checksum_address(settings.agrichain_contract_address),
        abi=abi,
    )
    return w3, contract


# We keep these module-level but allow them to be None if misconfigured.
_w3, _contract = _get_client_and_contract()
_SENDER_ADDRESS: str | None = None
if _w3 is not None and settings.polygon_private_key:
    _SENDER_ADDRESS = _w3.eth.account.from_key(settings.polygon_private_key).address


def _send_tx(fn, **fn_kwargs: Any) -> str:
    """Build, sign and send a transaction. Returns tx hash (or empty string).

    If config is missing, this becomes a no-op but logs to console.
    """

    # Derive a safe name for logging; web3 v7 may not expose function_identifier
    fn_name = getattr(fn, "function_identifier", getattr(fn, "fn_name", "<unknown_fn>"))

    if _w3 is None or _contract is None or _SENDER_ADDRESS is None:
        print("[BC] Blockchain not configured, skipping tx", fn_name)
        return ""

    try:
        nonce = _w3.eth.get_transaction_count(_SENDER_ADDRESS)
        # Note: Polygon Amoy currently enforces a minimum priority fee (~25 gwei),
        # so we set a comfortably higher tip and max fee for reliability.
        tx = fn(**fn_kwargs).build_transaction(
            {
                "from": _SENDER_ADDRESS,
                "nonce": nonce,
                "gas": 500_000,
                "maxFeePerGas": _w3.to_wei("60", "gwei"),
                "maxPriorityFeePerGas": _w3.to_wei("30", "gwei"),
            }
        )
        signed = _w3.eth.account.sign_transaction(tx, private_key=settings.polygon_private_key)
        # web3 v7 uses snake_case raw_transaction instead of rawTransaction
        raw_tx = getattr(signed, "raw_transaction", getattr(signed, "rawTransaction", None))
        if raw_tx is None:
            raise RuntimeError("SignedTransaction has no raw_transaction field")
        tx_hash = _w3.eth.send_raw_transaction(raw_tx)
        hex_hash = tx_hash.hex()
        print("[BC] Sent tx", fn_name, hex_hash)
        return hex_hash
    except Exception as exc:  # pragma: no cover - integration / network errors
        print("[BC] Error sending tx", fn_name, exc)
        return ""


# --- Helper functions called from routers / repositories --------------------


def _to_timestamp(dt: datetime | date | None) -> int:
    if isinstance(dt, datetime):
        return int(dt.timestamp())
    if isinstance(dt, date):
        return int(datetime.combine(dt, datetime.min.time()).timestamp())
    return int(datetime.utcnow().timestamp())


def bc_record_batch_created(
    batch_id: str,
    crop_name: str,
    quantity_kg: float,
    harvest_dt: datetime | date | None,
    image_url: str | None,
) -> str:
    """Blockchain log for: farmer creates a new batch."""

    if _contract is None:
        print("[BC] Contract not ready, skip batch_created")
        return ""

    fn = _contract.functions.recordBatchCreated
    return _send_tx(
        fn,
        batchId=batch_id,
        cropName=crop_name,
        quantityKg=int(quantity_kg),
        harvestDate=_to_timestamp(harvest_dt),
        imageUrl=image_url or "",
    )


def bc_record_ai_quality(
    batch_id: str,
    freshness: str,
    spoilage: str,
    damage: str,
    confidence: float,
) -> str:
    """Blockchain log for: AI quality check completed."""

    if _contract is None:
        print("[BC] Contract not ready, skip ai_quality")
        return ""

    fn = _contract.functions.recordAIQuality
    return _send_tx(
        fn,
        batchId=batch_id,
        freshness=freshness,
        spoilage=spoilage,
        damage=damage,
        confidence=int(confidence * 100),  # assume 0.0-1.0 -> 0-100
    )


def bc_record_pickup(
    batch_id: str,
    pickup_dt: datetime,
    vehicle_number: str,
    destination: str,
) -> str:
    """Blockchain log for: distributor pickup confirmation."""

    if _contract is None:
        print("[BC] Contract not ready, skip pickup")
        return ""

    fn = _contract.functions.recordPickup
    return _send_tx(
        fn,
        batchId=batch_id,
        pickupTime=_to_timestamp(pickup_dt),
        vehicleNumber=vehicle_number,
        destination=destination,
    )


def bc_record_delivery(
    batch_id: str,
    arrival_dt: datetime,
    retailer_id_or_name: str,
) -> str:
    """Blockchain log for: distributor delivery confirmation."""

    if _contract is None:
        print("[BC] Contract not ready, skip delivery")
        return ""

    fn = _contract.functions.recordDelivery
    return _send_tx(
        fn,
        batchId=batch_id,
        arrivalTime=_to_timestamp(arrival_dt),
        retailerIdOrName=retailer_id_or_name,
    )


def bc_record_retailer_price(
    batch_id: str,
    original_price: float,
    discount_percent: float,
    final_price: float,
) -> str:
    """Blockchain log for: retailer sets / updates selling price."""

    if _contract is None:
        print("[BC] Contract not ready, skip retailer_price")
        return ""

    fn = _contract.functions.recordRetailerPrice
    return _send_tx(
        fn,
        batchId=batch_id,
        originalPricePerKg=int(original_price * 100),
        discountPercent=int(discount_percent),
        finalPricePerKg=int(final_price * 100),
    )
