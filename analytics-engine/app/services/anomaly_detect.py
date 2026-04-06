import pandas as pd

class AnomalyDetector:
    @staticmethod
    def detect_outliers(df: pd.DataFrame):
        """
        Uses the Z-Score method to find expenses that are 
        unusually high compared to the user's average.
        """
        if df.empty or len(df) < 5: # Need at least 5 expenses to have a meaningful average
            return []

        mean = df['amount'].mean()
        std = df['amount'].std()
        threshold = mean + (2 * std) # Anything 2 standard deviations away

        anomalies = df[df['amount'] > threshold]
        
        result = []
        for _, row in anomalies.iterrows():
            result.append({
                "id": str(row['id']),
                "description": row['description'],
                "amount": float(row['amount']),
                "date": row['date'].strftime('%Y-%m-%d'),
                "reason": f"Gastaste {round(row['amount']/mean, 1)}x más de tu promedio."
            })
            
        return result