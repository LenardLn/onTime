from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from enpoints import locations, register, login, me
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
    allow_origins=["*"],       # only these URLs can access
    allow_credentials=True,
    allow_methods=["*"],         # CRUD operations allowed
    allow_headers=["*"],
)

app.include_router(locations.router)
app.include_router(register.router)
app.include_router(login.router)
app.include_router(me.router)
# app.include_router(login.router)
