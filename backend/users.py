from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hardcoded users — in production use a real database
# To generate a new hash: pwd_context.hash("yourpassword")
USERS = {
    "admin": {
        "username": "admin",
        "hashed_password": pwd_context.hash("admin123"),
        "role": "admin"
    },
    "client": {
        "username": "client",
        "hashed_password": pwd_context.hash("client123"),
        "role": "client"
    }
}


def get_user(username: str):
    return USERS.get(username)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user