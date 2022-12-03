from flask import Flask
from flask_migrate import upgrade

from database import init_db

app = Flask(__name__)
app.config.from_object("config.Config")

init_db(app)

with app.app_context():
    upgrade()
