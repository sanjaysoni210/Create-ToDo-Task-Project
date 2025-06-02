from flask import Flask, render_template
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db
from config import Config
from routes import bp as api_bp

app = Flask(__name__, static_folder='static', template_folder='templates')

app.config.from_object(Config)
CORS(app)

db.init_app(app)
jwt = JWTManager(app)
app.register_blueprint(api_bp)

# ✅ Serve the login page
@app.route('/login')
def login():
    return render_template('login.html')

# ✅ Serve the ToDo app main page
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
