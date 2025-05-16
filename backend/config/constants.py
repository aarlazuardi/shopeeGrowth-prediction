import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAMPLE_DATA_PATH = os.path.join(BASE_DIR, "data", "sample_shopee.csv")
ALLOWED_METHODS = ["linear", "polynomial", "spline", "lagrange"]
