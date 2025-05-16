"""
Data endpoints for Shopee Growth Prediction Backend
"""
from flask import Blueprint, request, jsonify, current_app
import os
import pandas as pd
import json
from backend.app.services.validator import validate_years_consecutive, validate_user_counts, validate_csv_columns
from backend.config.constants import SAMPLE_DATA_PATH
import logging

bp = Blueprint('data', __name__)

@bp.route('/', methods=['GET', 'POST'])
def handle_data():
    """GET: Returns sample data from CSV. POST: Accepts CSV upload, validates, returns parsed JSON."""
    if request.method == 'GET':
        try:
            df = pd.read_csv(SAMPLE_DATA_PATH)
            # Map CSV columns to expected keys
            data = [
                {
                    'year': int(row['year']),
                    'users': float(row['users_millions']),
                    'event': row.get('key_event', None)
                }
                for _, row in df.iterrows()
            ]
            return jsonify(data)
        except Exception as e:
            logging.error(f"Error loading sample data: {e}")
            return jsonify({"error": "Failed to load sample data", "details": str(e)}), 500
    # POST: CSV upload
    if 'file' not in request.files:
        return jsonify({"error": "No file part in request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    try:
        df = pd.read_csv(file)
        valid_cols, msg = validate_csv_columns(df.columns)
        if not valid_cols:
            return jsonify({"error": msg}), 400
        data = df.to_dict(orient='records')
        valid_years, msg = validate_years_consecutive(data)
        if not valid_years:
            return jsonify({"error": "Invalid year sequence", "details": msg}), 400
        valid_users, msg = validate_user_counts(data)
        if not valid_users:
            return jsonify({"error": "Invalid user counts", "details": msg}), 400
        return jsonify(data)
    except Exception as e:
        logging.error(f"CSV upload error: {e}")
        return jsonify({"error": "CSV processing failed", "details": str(e)}), 400

@bp.route('/sample', methods=['GET'])
def get_sample_data():
    """GET: Returns sample Shopee CSV data as JSON."""
    try:
        df = pd.read_csv(SAMPLE_DATA_PATH)
        logging.info(f"Sample data columns: {df.columns.tolist()}")
        logging.info(f"Sample data first row: {df.iloc[0].to_dict()}")
        
        # Map CSV columns to expected keys - consistent with handle_data method
        data = [
            {
                'year': int(row['year']),
                'users': float(row['users_millions']),
                'event': row.get('key_event', None)
            }
            for _, row in df.iterrows()
        ]
        
        logging.info(f"Returning {len(data)} sample data points")
        return jsonify(data)
    except Exception as e:
        logging.error(f"Error loading sample CSV: {e}")
        return jsonify({"error": "Failed to load sample CSV", "details": str(e)}), 500
