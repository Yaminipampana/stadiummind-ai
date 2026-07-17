import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
  PROJECT_NAME: str = "StadiumMind AI"
  API_V1_STR: str = "/api/v1"
  
  # CORS Origins
  BACKEND_CORS_ORIGINS: list[str] = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
  ]
  
  # PostgreSQL Connection Configurations
  POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
  POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
  POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
  POSTGRES_DB: str = os.getenv("POSTGRES_DB", "stadiummind_db")
  POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
  
  @property
  def SQLALCHEMY_DATABASE_URI(self) -> str:
    return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

  # AI Architecture Configurations
  GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY", None)
  AI_MODEL_NAME: str = "gemini-1.5-flash"
  
  # Cryptographic Security
  SECRET_KEY: str = os.getenv("SECRET_KEY", "stadiummind_super_secret_key_2026_fifa_cup")
  ALGORITHM: str = "HS256"
  ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day expiration
  
  class Config:
    case_sensitive = True

settings = Settings()
