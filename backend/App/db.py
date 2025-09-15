from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from backend.App.config import settings

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass


DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
