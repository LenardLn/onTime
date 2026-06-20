from endpoints import locations, register, lines, routes, stations, login, me, logout, lineStations, simulation, users, analytics, buses
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

from models.errors.Errors import AppError


app = FastAPI()

# Explicit allowlist of browser origins permitted to send credentialed requests.
# Override in deployment via ALLOWED_ORIGINS (comma-separated), e.g.
# ALLOWED_ORIGINS="http://localhost:5173,https://admin.example.com".
# NOTE: a wildcard here together with allow_credentials=True would let any site
# drive this API with a logged-in user's cookie, so keep it specific.
origins = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if o.strip()
]


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": exc.message,
            "error_code": exc.error_code,
        },
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(locations.router)
app.include_router(register.router)
app.include_router(lines.router)
app.include_router(routes.router)
app.include_router(login.router)
app.include_router(me.router)
app.include_router(stations.router)
app.include_router(logout.router)
app.include_router(lineStations.router)
app.include_router(simulation.router)
app.include_router(users.router)
app.include_router(analytics.router)
app.include_router(buses.router)
