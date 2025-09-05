from passlib.context import CryptContext

# Configura o passlib para usar bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Gera o hash da senha."""
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """Compara senha em texto com hash armazenado."""
    return pwd_context.verify(password, hashed_password)
