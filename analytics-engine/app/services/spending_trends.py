import pandas as pd
from typing import Dict, Any

class SpendingAnalytics:
    @staticmethod
    def get_category_distribution(df: pd.DataFrame) -> Dict[str, Any]:
        """
        Calculates total spent per category for pie charts.
        """
        if df.empty:
            return {}
        
        dist = df.groupby('category_name')['amount'].sum().sort_values(ascending=False)
        return dist.to_dict()

    @staticmethod
    def get_monthly_trend(df: pd.DataFrame) -> list:
        """
        Groups expenses by date to show a trend line.
        Returns a list of dicts: [{"date": "2023-01-01", "amount": 150.0}, ...]
        """
        if df.empty:
            return []
        
        # Ensure date is index and resample by Day
        df_copy = df.copy()
        df_copy.set_index('date', inplace=True)
        trend = df_copy.resample('D')['amount'].sum().reset_index()
        
        # Format date for JSON
        trend['date'] = trend['date'].dt.strftime('%Y-%m-%d')
        return trend.to_dict(orient='records')

    @staticmethod
    def get_weekday_analysis(df: pd.DataFrame) -> Dict[str, float]:
        """
        Analyzes which days of the week you spend the most.
        """
        if df.empty:
            return {}
        
        df_copy = df.copy()
        df_copy['weekday'] = df_copy['date'].dt.day_name()
        days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        weekday_avg = df_copy.groupby('weekday')['amount'].sum().reindex(days_order).fillna(0)
        return weekday_avg.to_dict()