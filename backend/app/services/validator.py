"""
Data validation utilities for Shopee Growth Prediction
"""
from typing import List, Dict, Tuple

__all__ = ["validate_years_consecutive", "validate_user_counts", "validate_csv_columns"]

def validate_years_consecutive(data: List[Dict]) -> Tuple[bool, str]:
    """Check if years are consecutive."""
    years = [row['year'] for row in data]
    for i in range(1, len(years)):
        if years[i] != years[i-1] + 1:
            return False, "Years must be consecutive"
    return True, ""

def validate_user_counts(data: List[Dict]) -> Tuple[bool, str]:
    """Check if user counts are positive numbers."""
    for row in data:
        if not isinstance(row['users'], (int, float)) or row['users'] <= 0:
            return False, "User counts must be positive numbers"
    return True, ""

def validate_csv_columns(columns: List[str]) -> Tuple[bool, str]:
    """Check if CSV columns are correct."""
    required = {'year', 'users'}
    if not required.issubset(set(columns)):
        return False, "CSV must have 'year' and 'users' columns"
    return True, ""
