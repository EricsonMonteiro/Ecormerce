import os
import httpx
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, User
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/callback/google")
TOKEN_URL = "https://oauth2.googleapis.com/token"
USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AuthCode(BaseModel):
    code: str

@app.post("/auth/google")
async def google_auth(auth_data: AuthCode, db: Session = Depends(get_db)):
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Google OAuth not configured on backend")
        
    async with httpx.AsyncClient() as client:
        # 1. Exchange code for access_token
        token_response = await client.post(
            TOKEN_URL,
            data={
                "code": auth_data.code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        token_data = token_response.json()
        
        if token_response.status_code != 200 or "access_token" not in token_data:
            print("Token error:", token_data)
            raise HTTPException(status_code=400, detail="Failed to exchange code for token")
            
        access_token = token_data["access_token"]
        refresh_token = token_data.get("refresh_token")
        
        # 2. Get user info
        userinfo_response = await client.get(
            USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_data = userinfo_response.json()
        
        if userinfo_response.status_code != 200:
            print("User info error:", user_data)
            raise HTTPException(status_code=400, detail="Failed to fetch user info")
            
        provider_id = user_data.get("sub")
        email = user_data.get("email")
        name = user_data.get("name")
        avatar = user_data.get("picture")
        
        if not provider_id:
            raise HTTPException(status_code=400, detail="Provider ID not found")
            
        # 3. Create or update user in database
        db_user = db.query(User).filter(User.provider == "google", User.provider_id == provider_id).first()
        if db_user:
            db_user.name = name
            db_user.email = email
            db_user.avatar = avatar
            db.commit()
            db.refresh(db_user)
        else:
            db_user = User(
                provider="google",
                provider_id=provider_id,
                name=name,
                email=email,
                avatar=avatar
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
        # 4. Return user info and token to frontend
        return {
            "user": {
                "id": db_user.id,
                "provider_id": provider_id,
                "name": name,
                "email": email,
                "avatar": avatar,
                "accessToken": access_token,
                "refreshToken": refresh_token,
            }
        }
