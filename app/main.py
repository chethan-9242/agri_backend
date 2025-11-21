from fastapi import FastAPI

from .routers import auth, farmer, distributor, retailer, consumer, alerts, chat, ai_assistant
from .database import test_connection

app = FastAPI(
    title="AgriChain – Supply Chain Transparency Backend",
    version="0.1.0",
)


@app.on_event("startup")
def on_startup() -> None:
    # This will print a message in the console about MySQL connection status
    test_connection()

app.include_router(auth.router)
app.include_router(farmer.router)
app.include_router(distributor.router)
app.include_router(retailer.router)
app.include_router(consumer.router)
app.include_router(alerts.router)
app.include_router(chat.router)
app.include_router(ai_assistant.router)
