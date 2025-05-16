"""
Math interpolation algorithms for Shopee Growth Prediction
"""
from typing import List
import numpy as np
from scipy.interpolate import CubicSpline, lagrange, interp1d, BarycentricInterpolator
import logging

__all__ = ["linear_interpolation", "polynomial_interpolation", "spline_interpolation", "lagrange_interpolation"]


def linear_interpolation(x: List[float], y: List[float], target_x: List[float]) -> List[float]:
    """Linear interpolation between points.
    Args:
        x: Known x values (years)
        y: Known y values (users)
        target_x: X values to predict
    Returns:
        List of interpolated y values
    """
    try:
        # Menggunakan scipy.interpolate.interp1d untuk interpolasi linear yang lebih robust
        f = interp1d(x, y, kind='linear', bounds_error=False, fill_value='extrapolate')
        return f(target_x).tolist()
    except Exception as e:
        logging.error(f"Linear interpolation error: {e}")
        # Fallback ke numpy.interp jika interp1d gagal
        return np.interp(target_x, x, y).tolist()


def polynomial_interpolation(x: List[float], y: List[float], target_x: List[float], degree: int = None) -> List[float]:
    """Polynomial interpolation using numpy polyfit.
    Args:
        x: Known x values
        y: Known y values
        target_x: X values to predict
        degree: Degree of polynomial (default: min(len(x)-1, 3))
    Returns:
        List of predicted y values
    """
    try:
        # Tentukan derajat optimal berdasarkan jumlah data
        # Gunakan minimal dari (jumlah data - 1) atau 3 untuk mencegah overfitting
        if degree is None:
            degree = min(len(x) - 1, 3)
            
        logging.info(f"Using polynomial degree {degree} for {len(x)} data points")
        
        # Hitung koefisien polinomial
        coeffs = np.polyfit(x, y, degree)
        poly = np.poly1d(coeffs)
        
        # Kalkulasi nilai-nilai prediksi
        predictions = poly(target_x).tolist()
        
        # Cek hasil negatif dan ganti dengan nilai minimum data historis jika ada
        min_y = min(y)
        for i, pred in enumerate(predictions):
            if pred < 0:
                logging.warning(f"Negative prediction {pred} at year {target_x[i]}, replacing with {min_y}")
                predictions[i] = min_y
                
        return predictions
    except Exception as e:
        logging.error(f"Polynomial interpolation error: {e}")
        # Fallback ke interpolasi linear jika polynomial gagal
        return linear_interpolation(x, y, target_x)


def spline_interpolation(x: List[float], y: List[float], target_x: List[float]) -> List[float]:
    """Cubic spline interpolation using scipy.
    Args:
        x: Known x values
        y: Known y values
        target_x: X values to predict
    Returns:
        List of predicted y values
    """
    try:
        # Pastikan ada cukup data untuk cubic spline (minimal 3 titik data)
        if len(x) < 3:
            logging.warning(f"Not enough data points ({len(x)}) for cubic spline, falling back to linear")
            return linear_interpolation(x, y, target_x)
            
        # Gunakan boundary condition 'not-a-knot' untuk hasil yang lebih natural pada ekstrapolasi
        cs = CubicSpline(x, y, bc_type='not-a-knot')
        predictions = cs(target_x).tolist()
        
        # Cek hasil negatif dan ganti dengan nilai minimum data historis jika ada
        min_y = min(y)
        for i, pred in enumerate(predictions):
            if pred < 0:
                logging.warning(f"Negative spline prediction {pred} at year {target_x[i]}, replacing with {min_y}")
                predictions[i] = min_y
                
        return predictions
    except Exception as e:
        logging.error(f"Spline interpolation error: {e}")
        # Fallback ke interpolasi linear jika spline gagal
        return linear_interpolation(x, y, target_x)


def lagrange_interpolation(x: List[float], y: List[float], target_x: List[float]) -> List[float]:
    """Lagrange polynomial interpolation using scipy.
    Args:
        x: Known x values
        y: Known y values
        target_x: X values to predict
    Returns:
        List of predicted y values
    """
    try:
        # Untuk data besar, Lagrange dapat mengalami masalah numerik
        # Gunakan BarycentricInterpolator yang lebih stabil untuk Lagrange interpolation
        if len(x) > 10:
            logging.info(f"Using BarycentricInterpolator for {len(x)} data points")
            interp = BarycentricInterpolator(x, y)
            predictions = [float(interp(xi)) for xi in target_x]
        else:
            # Untuk dataset kecil, gunakan implementasi Lagrange langsung
            logging.info(f"Using direct Lagrange interpolation for {len(x)} data points")
            poly = lagrange(x, y)
            predictions = [float(poly(xi)) for xi in target_x]
        
        # Cek hasil negatif dan ganti dengan nilai minimum data historis jika ada
        min_y = min(y)
        for i, pred in enumerate(predictions):
            if np.isnan(pred) or np.isinf(pred) or pred < 0:
                logging.warning(f"Invalid Lagrange prediction {pred} at year {target_x[i]}, replacing with {min_y}")
                predictions[i] = min_y
                
        return predictions
    except Exception as e:
        logging.error(f"Lagrange interpolation error: {e}")
        # Fallback ke polynomial interpolation jika lagrange gagal
        return polynomial_interpolation(x, y, target_x)
