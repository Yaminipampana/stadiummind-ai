from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

import os
# Engine configuration with automatic SQLite fallback if PostgreSQL is unreachable or driver is missing
try:
    import psycopg2
    from sqlalchemy import text
    temp_engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URI,
        pool_pre_ping=True,  # Check connection health on checkouts
        pool_size=20,        # Production pool size
        max_overflow=10,     # Max overflow connections
        connect_args={"connect_timeout": 2}  # Short timeout for startup fallback check
    )
    # Test connection health
    with temp_engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    engine = temp_engine
except (ImportError, Exception):
    sqlite_db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "stadiummind.db")
    engine = create_engine(
        f"sqlite:///{sqlite_db_path}",
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db() -> Generator:
    """Dependency generator for FastAPI endpoint session injection."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
