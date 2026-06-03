from endpoints import locations, register, lines, routes, stations, login, me, logout, lineStations, simulation
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from models.errors.Errors import AppError


app = FastAPI()

origins = [
    "http://localhost:5173",
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
    allow_origins=[],
    allow_origin_regex=r"https?://.*",
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