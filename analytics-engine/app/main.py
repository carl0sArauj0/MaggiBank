from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.services.processor import DataProcessor
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# Allow the Mobile App to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # not in production yet 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "online", "message": "MaggiBank Analytics is barking! 🐾"}

@app.get("/analytics/summary/{user_id}")
async def get_user_summary(user_id: str):
    """
    Example Endpoint: Returns basic math processed by Python/Pandas
    """
    df_expenses = DataProcessor.get_user_expenses_df(user_id)
    df_patrimonio = DataProcessor.get_user_patrimonio_df(user_id)
    
    if df_expenses.empty and df_patrimonio.empty:
        return {"message": "No data found for this user"}

    total_spent = df_expenses['amount'].sum() if not df_expenses.empty else 0
    total_wealth = df_patrimonio['balance'].sum() if not df_patrimonio.empty else 0
    
    # Simple Python logic: Top Category
    top_cat = "N/A"
    if not df_expenses.empty:
        top_cat = df_expenses.groupby('category_name')['amount'].sum().idxmax()

    return {
        "user_id": user_id,
        "metrics": {
            "total_spent": total_spent,
            "current_patrimonio": total_wealth,
            "most_expensive_category": top_cat
        }
    }