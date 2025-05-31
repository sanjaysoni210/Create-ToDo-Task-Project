from flask import Flask
from flask_jwt_extended import JWTManager
from models import db
from config import Config
from routes import bp as api_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
jwt = JWTManager(app)
app.register_blueprint(api_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
