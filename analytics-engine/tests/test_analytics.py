import pytest
import pandas as pd
from datetime import datetime, timedelta
from app.services.spending_trends import SpendingAnalytics
from app.services.wealth_projections import WealthProjections
from app.services.anomaly_detect import AnomalyDetector

# --- FIXTURES (Datos de prueba) ---
@pytest.fixture
def sample_expenses_df():
    """Crea una muestra de 10 gastos. Con 10 datos, el Z-score de 2.0 es detectable."""
    today = datetime.now()
    data = {
        'id': [str(i) for i in range(10)],
        # 9 gastos normales y 1 gasto extremadamente alto (anomalía)
        'amount': [10.0, 12.0, 11.0, 13.0, 10.0, 12.0, 11.0, 14.0, 10.0, 800.0],  
        'category_name': ['Comida']*9 + ['Lujo'],
        'description': ['Gasto diario']*9 + ['Gasto Loco'],
        'date': [today - timedelta(days=i) for i in range(10)]
    }
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    return df

# --- PRUEBAS DE SPENDING TRENDS ---
def test_category_distribution(sample_expenses_df):
    result = SpendingAnalytics.get_category_distribution(sample_expenses_df)
    # 9 gastos de ~11 promedio en Comida + 800 en Lujo
    assert result['Lujo'] == 800.0
    assert result['Comida'] > 90.0

def test_weekday_analysis(sample_expenses_df):
    result = SpendingAnalytics.get_weekday_analysis(sample_expenses_df)
    assert len(result) == 7
    assert isinstance(result, dict)

# --- PRUEBAS DE ANOMALY DETECT ---
def test_anomaly_detection(sample_expenses_df):
    """Con 10 datos, el outlier de 800.0 será detectado correctamente."""
    anomalies = AnomalyDetector.detect_outliers(sample_expenses_df)
    assert len(anomalies) > 0
    assert anomalies[0]['amount'] == 800.0
    assert "Gasto Loco" in anomalies[0]['description']

# --- PRUEBAS DE WEALTH PROJECTIONS ---
def test_wealth_projections(sample_expenses_df):
    current_balance = 1000.0
    result = WealthProjections.predict_growth(current_balance, sample_expenses_df, months=3)
    assert len(result) == 3
    assert result[0]['estimated_balance'] > 1000.0

# --- PRUEBA DE CASO VACÍO ---
def test_empty_dataframe():
    empty_df = pd.DataFrame()
    dist = SpendingAnalytics.get_category_distribution(empty_df)
    trend = SpendingAnalytics.get_monthly_trend(empty_df)
    assert dist == {}
    assert trend == []