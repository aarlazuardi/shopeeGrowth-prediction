"""
Flask app factory for Shopee Growth Prediction Backend
"""
import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()

def create_app() -> Flask:
    """Flask application factory."""
    app = Flask(__name__)

    # Load config from environment variables or defaults
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev')
    app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', './uploads')
    app.config['SAMPLE_DATA_PATH'] = os.environ.get('SAMPLE_DATA_PATH', './config/sample_data.json')
    app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB max upload

    # Enable CORS for Next.js frontend
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    # Register blueprints (import dari backend.app.routes)
    from backend.app.routes.data import bp as data_bp
    from backend.app.routes.predict import bp as predict_bp
    from backend.app.routes.calculator import bp as calculator_bp
    app.register_blueprint(data_bp, url_prefix='/data')
    app.register_blueprint(predict_bp, url_prefix='/predict')
    app.register_blueprint(calculator_bp, url_prefix='/calculate')

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
