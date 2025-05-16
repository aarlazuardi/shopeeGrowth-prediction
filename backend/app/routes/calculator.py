"""
Calculator endpoint for Shopee Growth Prediction Backend
Implements various numerical interpolation methods
"""
from flask import Blueprint, request, jsonify
import logging
import numpy as np
from scipy.interpolate import interp1d, CubicSpline, BarycentricInterpolator

bp = Blueprint('calculator', __name__)

@bp.route('/', methods=['POST'])
def calculate():
    """
    Accepts calculation requests for various interpolation methods.
    
    Expected JSON payload:
    {
        "method": "linear|polynomial|spline|lagrange",
        "x": [x1, x2, ..., xn],
        "y": [y1, y2, ..., yn],
        "xToPredict": value
    }
    """
    try:
        req = request.get_json()
        
        # Validate required fields
        required_fields = ['method', 'x', 'y', 'xToPredict']
        for field in required_fields:
            if field not in req:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Extract data from request
        method = req.get('method')
        x_values = np.array(req.get('x'), dtype=float)
        y_values = np.array(req.get('y'), dtype=float)
        x_to_predict = float(req.get('xToPredict'))
        
        # Validate that x and y have same length
        if len(x_values) != len(y_values):
            return jsonify({"error": "x and y arrays must have the same length"}), 400
            
        # Validate that we have enough data points
        if len(x_values) < 2:
            return jsonify({"error": "At least two data points are required for interpolation"}), 400
        
        # Sort data by x values (to ensure correct interpolation)
        sort_indices = np.argsort(x_values)
        x_values = x_values[sort_indices]
        y_values = y_values[sort_indices]
        
        result = None
        details = None
        steps = []
        
        # Perform interpolation based on method
        if method == "linear":
            result, steps = linear_interpolation(x_values, y_values, x_to_predict)
        elif method == "polynomial":
            result, steps = polynomial_interpolation(x_values, y_values, x_to_predict)
        elif method == "spline":
            result, steps = spline_interpolation(x_values, y_values, x_to_predict)
        elif method == "lagrange":
            result, steps = lagrange_interpolation(x_values, y_values, x_to_predict)
        else:
            return jsonify({"error": f"Unsupported interpolation method: {method}"}), 400
        
        # Return result
        return jsonify({
            "interpolatedValue": float(result),
            "calculationSteps": steps,
            "inputData": {
                "x": x_values.tolist(),
                "y": y_values.tolist(),
                "xToPredict": x_to_predict
            },
            "method": method
        })
        
    except Exception as e:
        logging.error(f"Calculator error: {str(e)}")
        return jsonify({"error": "Calculation failed", "details": str(e)}), 400

def linear_interpolation(x, y, x_pred):
    """Perform linear interpolation"""
    try:
        # Use scipy's interp1d for linear interpolation with proper extrapolation
        interp_func = interp1d(x, y, kind='linear', bounds_error=False, fill_value='extrapolate')
        result = float(interp_func(x_pred))
        
        # Find the two closest points for explanation
        if x_pred <= x[0]:
            x0, y0 = x[0], y[0]
            x1, y1 = x[1], y[1]
        elif x_pred >= x[-1]:
            x0, y0 = x[-2], y[-2]
            x1, y1 = x[-1], y[-1]
        else:
            idx = np.searchsorted(x, x_pred)
            x0, y0 = x[idx-1], y[idx-1]
            x1, y1 = x[idx], y[idx]
        
        # Create explanation steps
        steps = [
            f"Langkah 1: Identifikasi dua titik data terdekat dengan x = {x_pred}",
            f"- Titik 1: ({x0}, {y0})",
            f"- Titik 2: ({x1}, {y1})",
            f"Langkah 2: Terapkan rumus interpolasi linear:",
            f"y = y₀ + ((x - x₀) × (y₁ - y₀)) / (x₁ - x₀)",
            f"y = {y0} + (({x_pred} - {x0}) × ({y1} - {y0})) / ({x1} - {x0})",
            f"y = {y0} + (({x_pred - x0}) × ({y1 - y0})) / ({x1 - x0})",
            f"y = {result}"
        ]
        
        return result, steps
    except Exception as e:
        logging.error(f"Linear interpolation error: {str(e)}")
        raise

def polynomial_interpolation(x, y, x_pred):
    """Perform polynomial interpolation using Newton's divided difference"""
    try:
        n = len(x)
        
        # Create divided difference table
        div_diff = np.zeros((n, n))
        div_diff[:, 0] = y
        
        for j in range(1, n):
            for i in range(n-j):
                div_diff[i, j] = (div_diff[i+1, j-1] - div_diff[i, j-1]) / (x[i+j] - x[i])
        
        # Calculate interpolated value using Newton's form
        result = div_diff[0, 0]
        term = 1
        
        for i in range(1, n):
            term *= (x_pred - x[i-1])
            result += div_diff[0, i] * term
        
        # Create explanation steps
        steps = [
            f"Langkah 1: Membuat tabel perbedaan terbagi Newton untuk interpolasi polinomial",
            f"Tabel perbedaan terbagi (nilai koefisien):",
        ]
        
        # Add coefficients to steps
        steps.append(f"f[x0] = {div_diff[0, 0]}")
        for i in range(1, min(n, 4)):
            steps.append(f"f[x0,...,x{i}] = {div_diff[0, i]}")
        
        # Add polynomial expression
        poly_expr = f"P(x) = {div_diff[0, 0]}"
        for i in range(1, min(n, 4)):
            term_expr = ""
            for j in range(i):
                term_expr += f"(x - {x[j]})"
            if div_diff[0, i] >= 0:
                poly_expr += f" + {div_diff[0, i]}{term_expr}"
            else:
                poly_expr += f" - {abs(div_diff[0, i])}{term_expr}"
        
        steps.append(f"Langkah 2: Polinomial Newton:")
        steps.append(poly_expr)
        steps.append(f"Langkah 3: Mengevaluasi pada x = {x_pred}:")
        steps.append(f"P({x_pred}) = {result}")
        
        return result, steps
    except Exception as e:
        logging.error(f"Polynomial interpolation error: {str(e)}")
        raise

def spline_interpolation(x, y, x_pred):
    """Perform cubic spline interpolation"""
    try:
        if len(x) < 3:
            # Fall back to linear interpolation if fewer than 3 points
            return linear_interpolation(x, y, x_pred)
        
        # Use scipy's CubicSpline for interpolation
        spline = CubicSpline(x, y)
        result = float(spline(x_pred))
        
        # Find the interval containing x_pred
        if x_pred <= x[0]:
            interval_idx = 0
        elif x_pred >= x[-1]:
            interval_idx = len(x) - 2
        else:
            interval_idx = np.searchsorted(x, x_pred) - 1
        
        # Get the polynomial coefficients for this interval
        # CubicSpline uses ax^3 + bx^2 + cx + d form
        # We need to convert to a(x-xi)^3 + b(x-xi)^2 + c(x-xi) + d form
        poly_coeffs = spline.c[:, interval_idx]
        
        # Create explanation steps
        steps = [
            f"Langkah 1: Membagi data menjadi interval dan membuat spline kubik untuk setiap interval",
            f"Interval yang mengandung x = {x_pred} adalah [{x[interval_idx]}, {x[interval_idx+1]}]",
            f"Langkah 2: Koefisien spline untuk interval ini:",
            f"a = {poly_coeffs[0]} (koefisien x^3)",
            f"b = {poly_coeffs[1]} (koefisien x^2)",
            f"c = {poly_coeffs[2]} (koefisien x)",
            f"d = {poly_coeffs[3]} (konstanta)",
            f"Langkah 3: Mengevaluasi pada x = {x_pred}:",
            f"S({x_pred}) = {result}"
        ]
        
        return result, steps
    except Exception as e:
        logging.error(f"Spline interpolation error: {str(e)}")
        raise

def lagrange_interpolation(x, y, x_pred):
    """Perform Lagrange interpolation"""
    try:
        # Use scipy's BarycentricInterpolator for stable Lagrange interpolation
        interp = BarycentricInterpolator(x, y)
        result = float(interp(x_pred))
        
        # Manual calculation for explanation
        n = len(x)
        steps = [
            f"Langkah 1: Terapkan rumus interpolasi Lagrange:",
            f"P(x) = Σ y_j * L_j(x)",
            f"dimana L_j(x) = Π (x - x_i) / (x_j - x_i) untuk semua i ≠ j",
            f"Langkah 2: Hitung setiap polinomial basis Lagrange L_j(x) untuk x = {x_pred}:"
        ]
        
        # Calculate basis polynomials for explanation
        l_values = []
        for j in range(n):
            numerator = 1
            denominator = 1
            basis_terms = []
            
            for i in range(n):
                if i != j:
                    numerator *= (x_pred - x[i])
                    denominator *= (x[j] - x[i])
                    basis_terms.append(f"({x_pred} - {x[i]}) / ({x[j]} - {x[i]})")
            
            l_j = numerator / denominator
            l_values.append(l_j)
            
            if len(basis_terms) <= 5:  # Limit explanation length
                steps.append(f"L_{j}({x_pred}) = {' × '.join(basis_terms)} = {l_j}")
        
        steps.append(f"Langkah 3: Kalikan setiap polinomial basis dengan nilai y yang sesuai dan jumlahkan:")
        
        sum_terms = []
        for j in range(min(n, 5)):  # Limit explanation length
            sum_terms.append(f"{y[j]} × {l_values[j]}")
        
        if n > 5:
            sum_terms.append("...")
            
        steps.append(f"P({x_pred}) = {' + '.join(sum_terms)}")
        steps.append(f"P({x_pred}) = {result}")
        
        return result, steps
    except Exception as e:
        logging.error(f"Lagrange interpolation error: {str(e)}")
        raise
