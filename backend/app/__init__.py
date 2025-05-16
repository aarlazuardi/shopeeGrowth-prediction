"""
Flask app factory for Shopee Growth Prediction Backend
"""
import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

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

    # Enable CORS for Next.js frontend (allow multiple origins)
    CORS(
        app,
        origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ],
        supports_credentials=True,
        methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type"]
    )

    # Register blueprints from routes
    from .routes.data import bp as data_bp
    from .routes.predict import bp as predict_bp
    from .routes.calculator import bp as calculator_bp
    app.register_blueprint(data_bp, url_prefix='/data')
    app.register_blueprint(predict_bp, url_prefix='/predict')
    app.register_blueprint(calculator_bp, url_prefix='/calculate')

    return app
