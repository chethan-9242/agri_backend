from __future__ import annotations

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from .config import settings
from .db_models import Base  # ORM models


def _build_database_url() -> str:
    """Build MySQL URL from settings if DATABASE_URL is not provided."""
    if settings.database_url:
        return settings.database_url

    user = settings.db_user
    password = settings.db_password
    host = settings.db_host
    port = settings.db_port
    name = settings.db_name

    # mysql+pymysql://user:password@host:port/dbname
    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}"


DATABASE_URL = _build_database_url()

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# We are mapping existing tables, so we don't call Base.metadata.create_all(engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_connection() -> None:
    """Try a simple SELECT 1 and print a clear message to the console."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print(f"✅ Connected to MySQL database at {DATABASE_URL}")
    except Exception as exc:  # pragma: no cover - startup-time failure
        print("❌ Failed to connect to MySQL database:", exc)
        raise