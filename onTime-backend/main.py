from fastapi import FastAPI
from enpoints import locations, register, buses
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # only these URLs can access
    allow_credentials=True,
    allow_methods=["*"],         # CRUD operations allowed
    allow_headers=["*"],
)

app.include_router(locations.router)
app.include_router(register.router)
app.include_router(buses.router)
# app.include_router(login.router)
