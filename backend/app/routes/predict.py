"""
Prediction endpoint for Shopee Growth Prediction Backend
"""
from flask import Blueprint, request, jsonify
from backend.app.services.interpolation import (
    linear_interpolation, 
    polynomial_interpolation, 
    spline_interpolation,
    lagrange_interpolation
)
from backend.app.services.validator import validate_years_consecutive, validate_user_counts
from backend.config.constants import ALLOWED_METHODS
import logging

bp = Blueprint('predict', __name__)

@bp.route('/', methods=['POST'])
@bp.route('', methods=['POST'])
def predict():
    """Input: {method: 'linear'|'polynomial'|'spline'|'lagrange', data: [{year, users}], steps: int}
    Output: {equation: str, predictions: [{year, users}]}
    """
    try:
        req = request.get_json()
        if not req:
            return jsonify({"error": "Invalid JSON in request body"}), 400
        
        method = req.get('method')
        data = req.get('data')
        steps = req.get('steps', 1)
        
        # Debug logging to help diagnose issues
        logging.debug(f"Received prediction request: method={method}, data length={len(data) if data else None}, steps={steps}")
        
        if not method:
            return jsonify({"error": "Missing 'method' in request"}), 400
        if not data:
            return jsonify({"error": "Missing 'data' in request"}), 400
        if len(data) < 2:
            return jsonify({"error": "Insufficient data", "details": "At least 2 data points are required for interpolation"}), 400
        if method not in ALLOWED_METHODS:
            return jsonify({"error": f"Unknown method '{method}'. Allowed methods are: {ALLOWED_METHODS}"}), 400
            
        valid_years, msg = validate_years_consecutive(data)
        if not valid_years:
            return jsonify({"error": "Invalid year sequence", "details": msg}), 400
        valid_users, msg = validate_user_counts(data)
        if not valid_users:
            return jsonify({"error": "Invalid user counts", "details": msg}), 400
            
        x = [row['year'] for row in data]
        y = [row['users'] for row in data]
        last_year = x[-1]
        target_x = [last_year + i for i in range(1, steps + 1)]
        
        logging.info(f"Performing {method} interpolation with {len(x)} data points to predict {len(target_x)} future points")
        
        description = ""
        if method == 'linear':
            preds = linear_interpolation(x, y, target_x)
            eq = f"Linear interpolation: y = m*x + b (from {x[0]} to {x[-1]})"
            description = "Interpolasi linear menghasilkan prediksi dengan pertumbuhan konstan, optimal untuk tren yang stabil."
        elif method == 'polynomial':
            optimal_degree = min(len(x) - 1, 3)
            preds = polynomial_interpolation(x, y, target_x, degree=optimal_degree)
            eq = f"Polynomial degree {optimal_degree}: P(x) = a{optimal_degree}*x^{optimal_degree} + ... + a1*x + a0"
            description = "Interpolasi polinomial menghasilkan kurva yang lebih fleksibel, cocok untuk pertumbuhan yang meningkat atau menurun secara konsisten."
        elif method == 'spline':
            preds = spline_interpolation(x, y, target_x)
            eq = f"Cubic Spline: S(x) = piecewise cubic functions connecting {len(x)} points"
            description = "Interpolasi spline kubik menghasilkan kurva yang halus dengan konsistensi turunan, ideal untuk data dengan perubahan bertahap."
        elif method == 'lagrange':
            preds = lagrange_interpolation(x, y, target_x)
            eq = f"Lagrange polynomial: L(x) = sum(y_i * product(x-x_j)/(x_i-x_j)) for all points"
            description = "Interpolasi Lagrange menghasilkan kurva yang melewati semua titik data dengan tepat, cocok untuk data kompleks dengan pola berulang."
        else:
            return jsonify({"error": "Unknown method"}), 400
            
        # Log hasil prediksi
        logging.info(f"Prediction results: {preds}")
        
        predictions = [{"year": tx, "users": round(py, 2)} for tx, py in zip(target_x, preds)]
        
        # Hitung statistik tambahan
        growth_rates = []
        last_historical_users = y[-1]
        
        for i, pred in enumerate(preds):
            if i == 0:
                growth_rate = ((pred - last_historical_users) / last_historical_users) * 100 if last_historical_users > 0 else 0
            else:
                growth_rate = ((pred - preds[i-1]) / preds[i-1]) * 100 if preds[i-1] > 0 else 0
            growth_rates.append(round(growth_rate, 2))
        
        # Tambahkan properti tambahan ke respons
        response = {
            "equation": eq,
            "description": description,
            "predictions": predictions,
            "statistics": {
                "growth_rates": growth_rates,
                "average_growth_rate": round(sum(growth_rates) / len(growth_rates), 2) if growth_rates else 0,
                "total_growth": round(((preds[-1] - last_historical_users) / last_historical_users) * 100, 2) if last_historical_users > 0 else 0
            },
            "method": method,
            "data_points": len(x),
            "historical_range": f"{int(min(x))} - {int(max(x))}"
        }
        
        return jsonify(response)
        
    except Exception as e:
        logging.error(f"Prediction error: {e}")
        return jsonify({
            "error": "Prediction failed", 
            "details": str(e),
            "method": method if 'method' in locals() else "unknown"
        }), 400
