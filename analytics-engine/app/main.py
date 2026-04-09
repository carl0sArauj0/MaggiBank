from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from app.services.processor import DataProcessor
from app.services.spending_trends import SpendingAnalytics
from app.services.wealth_projections import WealthProjections
from app.services.anomaly_detect import AnomalyDetector
from app.models.schemas import AnalyticsResponse, WealthProjection, Anomaly
from typing import List
from pydantic import BaseModel

app = FastAPI(title="MaggiBank Analytics Engine 🐕")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BalanceUpdate(BaseModel):
    amount: float

# 1. BORRAR CUENTA
@app.delete("/accounts/{account_id}")
async def delete_account(account_id: str, userId: str = Query(...)):
    result = DataProcessor.delete_account(account_id, userId)
    if not result:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")
    return {"status": "success", "message": "Cuenta y gastos eliminados"}

# 2. ACTUALIZAR SALDO (Solo sumar)
@app.patch("/accounts/{account_id}/balance")
async def update_balance(account_id: str, data: BalanceUpdate, userId: str = Query(...)):
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="El monto debe ser mayor a cero")
        
    result = DataProcessor.update_balance(account_id, data.amount, userId)
    return {"status": "success", "new_balance": result}

# 3. OBTENER GASTOS POR CUENTA
@app.get("/expenses")
async def get_expenses(account_id: str = Query(...), userId: str = Query(...)):
    data = DataProcessor.get_expenses_by_account(account_id, userId)
    return {"data": data}

@app.get("/analytics/full-report/{user_id}")
async def get_full_report(user_id: str):
    # 1. Get Data
    df_expenses = DataProcessor.get_user_expenses_df(user_id)
    df_patrimonio = DataProcessor.get_user_patrimonio_df(user_id)
    
    if df_expenses.empty:
        raise HTTPException(status_code=404, detail="No data for analysis")

    current_balance = df_patrimonio['balance'].sum() if not df_patrimonio.empty else 0

    # 2. Process all modules
    return {
        "trends": {
            "categories": SpendingAnalytics.get_category_distribution(df_expenses),
            "daily": SpendingAnalytics.get_monthly_trend(df_expenses)
        },
        "projections": WealthProjections.predict_growth(current_balance, df_expenses),
        "alerts": AnomalyDetector.detect_outliers(df_expenses),
        "status": "Maggi analyzed your data successfully! 🐾"
    }

@app.get("/health")
def health():
    return {"status": "alive", "dog_name": "Maggi"}