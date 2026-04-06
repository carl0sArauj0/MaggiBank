from pydantic import BaseModel
from typing import List, Dict, Optional

class AnalysisSummary(BaseModel):
    total_spent: float
    current_patrimonio: float
    most_expensive_category: str

class TrendData(BaseModel):
    date: str
    amount: float

class AnalyticsResponse(BaseModel):
    category_distribution: Dict[str, float]
    daily_trend: List[TrendData]
    weekday_impact: Dict[str, float]
    total_period_spend: float

class WealthProjection(BaseModel):
    month: str
    estimated_balance: float

class Anomaly(BaseModel):
    id: str
    description: str
    amount: float
    date: str
    reason: str