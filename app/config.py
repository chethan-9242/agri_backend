from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str | None = None
    supabase_key: str | None = None

    # MySQL database config
    database_url: str | None = None
    db_host: str = "localhost"
    db_port: int = 3306
    db_name: str = "sc_supplychain"
    db_user: str = "root"
    db_password: str = ""

    # Auth / JWT
    jwt_secret: str = "dev-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # Gemini / RAG config
    gemini_api_key: str | None = None  # from GEMINI_API_KEY env var

    # Blockchain / Polygon config
    polygon_rpc_url: str | None = None
    polygon_private_key: str | None = None
    agrichain_contract_address: str | None = None

    class Config:
        env_file = ".env"


settings = Settings()
