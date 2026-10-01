import os
import sys
import joblib
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split

# Ensure backend root is on python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.ml.preprocessing import PreprocessingPipeline, FEATURE_COLUMNS, TARGET_COLUMNS
from app.ml.evaluation import compute_regression_metrics
from app.ml.model_registry import ModelRegistry
from app.db.mongodb import db_manager

def train_production_models():
    print("=" * 60)
    print("CARBONCORTEX: Training Real XGBoost Multi-Target Regressors")
    print("=" * 60)

    dataset_path = os.path.join(settings.DATA_DIR, "synthetic", "coal_samples_synthetic.csv")
    if not os.path.exists(dataset_path):
        print("Dataset not found. Generating synthetic dataset first...")
        from scripts.generate_demo_data import generate_synthetic_dataset
        dataset_path = generate_synthetic_dataset(output_dir=os.path.join(settings.DATA_DIR, "synthetic"))

    df = pd.read_csv(dataset_path)
    print(f"Loaded training data: {len(df)} records across 8 subsidiaries.")

    # Train/Validation/Test split (80/20)
    train_df, test_df = train_test_split(df, test_size=0.20, random_state=42)
    print(f"Training set: {len(train_df)} samples | Test set: {len(test_df)} samples")

    # Fit Preprocessing Pipeline
    pipeline = PreprocessingPipeline()
    X_train_scaled = pipeline.fit_transform(train_df)
    X_test_scaled = pipeline.transform(test_df)

    model_dir = settings.MODEL_DIR
    os.makedirs(model_dir, exist_ok=True)
    pipeline_path = os.path.join(model_dir, "preprocessing_pipeline.joblib")
    pipeline.save(pipeline_path)

    trained_models = {}
    model_paths = {}
    metrics_summary = {}

    # Hyperparameters tailored for coal geophysical regressions
    xgb_params = {
        "n_estimators": 120,
        "max_depth": 5,
        "learning_rate": 0.07,
        "subsample": 0.85,
        "colsample_bytree": 0.85,
        "random_state": 42,
        "n_jobs": -1
    }

    for target in TARGET_COLUMNS:
        print(f"\nTraining XGBoost Regressor for: [{target.upper()}] ...")
        y_train = train_df[target].values
        y_test = test_df[target].values

        model = xgb.XGBRegressor(**xgb_params)
        model.fit(X_train_scaled, y_train)

        # Evaluate on independent test set
        y_pred = model.predict(X_test_scaled)
        metrics = compute_regression_metrics(y_test, y_pred)
        metrics_summary[target] = metrics

        model_file = os.path.join(model_dir, f"model_{target}.joblib")
        joblib.dump(model, model_file)
        model_paths[target] = model_file
        trained_models[target] = model

        print(f"  --> R² Score: {metrics['r2']:.4f} | RMSE: {metrics['rmse']:.3f} | MAE: {metrics['mae']:.3f}")

    # Register Active Production Model in MongoDB
    version = "xgb-v1.0"
    print(f"\nRegistering {version} as ACTIVE in Model Registry...")
    db_manager.connect()
    ModelRegistry.register_version(
        version=version,
        status="ACTIVE",
        dataset_version="synthetic-v1.0-6000",
        training_samples=len(train_df),
        verified_samples=0,
        metrics=metrics_summary,
        model_paths=model_paths,
        preprocessing_path=pipeline_path
    )

    print("\n" + "=" * 60)
    print("SUCCESS: All models trained, validated, and saved to disk.")
    print(f"Directory: {model_dir}")
    print("=" * 60)
    return metrics_summary

if __name__ == "__main__":
    train_production_models()
