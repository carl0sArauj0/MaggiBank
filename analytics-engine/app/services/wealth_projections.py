import pandas as pd
from datetime import datetime, timedelta

class WealthProjections:
    @staticmethod
    def predict_growth(current_balance: float, expenses_df: pd.DataFrame, months: int = 6):
        """
        Calculates estimated wealth based on average monthly savings.
        """
        if expenses_df.empty:
            return []

        # Calculate average monthly spend
        expenses_df['month'] = expenses_df['date'].dt.to_period('M')
        monthly_avg_spend = expenses_df.groupby('month')['amount'].sum().mean()
        
        # We assume a static income for this MVP (can be expanded later)
        # For now, let's assume a "Saving Rate" or just use trends
        projections = []
        simulated_balance = current_balance
        
        for i in range(1, months + 1):
            # Simple logic: Every month we project a slight growth or decay
            # based on current behavior. 
            future_date = (datetime.now() + timedelta(days=30 * i)).strftime('%b %Y')
            
            # In a real app, you'd subtract monthly_avg_spend from a 'monthly_income'
            # Here we will simulate a 5% conservative growth if the user is a 'saver'
            simulated_balance *= 1.02  # 2% monthly growth simulation
            
            projections.append({
                "month": future_date,
                "estimated_balance": round(simulated_balance, 2)
            })
            
        return projections