from fastapi import FastAPI, WebSocket
from alerts import manager
from database import engine, Base
from admin_api import router as admin_router

app = FastAPI()


@app.on_event("startup")
def on_startup():
	# create DB tables
	Base.metadata.create_all(bind=engine)


@app.websocket("/ws/alerts")
def websocket_endpoint(websocket: WebSocket):
	# placeholder: delegate to alerts manager
	pass


app.include_router(admin_router, prefix="/api")
