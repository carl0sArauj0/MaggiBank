from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from app.services.processor import DataProcessor
from app.services.spending_trends import SpendingAnalytics
from app.services.wealth_projections import WealthProjections
from app.services.anomaly_detect import AnomalyDetector
from typing import List, Dict

app = FastAPI(title="MaggiBank Analytics Engine 🐕")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. SPENDING TRENDS (For Line Charts)
@app.get("/analytics/spending-trends")
async def get_spending_trends(userId: str = Query(...)):
    df = DataProcessor.get_user_expenses_df(userId)
    if df.empty: return {"data": []}
    
    trend = SpendingAnalytics.get_monthly_trend(df)
    formatted = [{"label": x['date'], "value": x['amount']} for x in trend]
    return {"data": formatted}

# 2. CATEGORY BREAKDOWN (For Pie Charts)
@app.get("/analytics/categories")
async def get_categories(userId: str = Query(...)):
    df = DataProcessor.get_user_expenses_df(userId)
    if df.empty: return {"data": []}
    
    dist = SpendingAnalytics.get_category_distribution(df)
    formatted = [{"category": k, "amount": v} for k, v in dist.items()]
    return {"data": formatted}

# 3. WEALTH GROWTH (Projections for Line Chart)
@app.get("/analytics/wealth-growth")
async def get_wealth_growth(userId: str = Query(...)):
    df_ex = DataProcessor.get_user_expenses_df(userId)
    df_acc = DataProcessor.get_user_patrimonio_df(userId)
    balance = df_acc['balance'].sum() if not df_acc.empty else 0
    
    projections = WealthProjections.predict_growth(balance, df_ex)
    formatted = [{"label": x['month'], "value": x['estimated_balance']} for x in projections]
    return {"data": formatted}

# 4. ANOMALIES (Barks for unusual spending)
@app.get("/analytics/anomalies")
async def get_anomalies(userId: str = Query(...)):
    df = DataProcessor.get_user_expenses_df(userId)
    alerts = AnomalyDetector.detect_outliers(df)
    formatted = [{
        "category": a['reason'], 
        "message": a['description'], 
        "excess": a['amount']
    } for a in alerts]
    return {"data": formatted}

# 5. MAGGI INSIGHTS (AI-style Advice)
@app.get("/analytics/insights")
async def get_insights(userId: str = Query(...)):
    df = DataProcessor.get_user_expenses_df(userId)
    if df.empty: return {"insights": []}
    
    top_cat = df.groupby('category_name')['amount'].sum().idxmax()
    
    # Generated "barking" advice
    return {
        "insights": [
            {
                "icon": "🍔", 
                "title": "Alerta de Hambre", 
                "message": f"Maggi nota que '{top_cat}' es tu mayor gasto. ¡Cuidado con los antojos!",
                "value": "Revisar"
            },
            {
                "icon": "📈", 
                "title": "Buen Camino", 
                "message": "Tu patrimonio ha crecido un 2% este mes. ¡Sigue así!",
                "value": "+2%"
            }
        ]
    }

# 6. WEALTH PROJECTIONS (Raw data for tables)
@app.get("/analytics/wealth-projections")
async def get_projections(userId: str = Query(...)):
    # Redirecting to wealth-growth logic
    return await get_wealth_growth(userId)

@app.get("/health")
def health():
    return {"status": "alive", "dog": "Maggi"}