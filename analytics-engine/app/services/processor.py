import pandas as pd
from supabase import create_client, Client
from app.core.config import settings

# Initialize Supabase Client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

class DataProcessor:
    @staticmethod
    def get_user_expenses_df(user_id: str) -> pd.DataFrame:
        """
        Fetches all expenses for a user and returns a clean Pandas DataFrame.
        """
        response = supabase.table("expenses").select("*").eq("user_id", user_id).execute()
        
        if not response.data:
            return pd.DataFrame()
            
        df = pd.DataFrame(response.data)
        
        # Data Cleaning
        df['amount'] = df['amount'].astype(float)
        df['date'] = pd.to_datetime(df['date'])
        
        return df

    @staticmethod
    def get_user_patrimonio_df(user_id: str) -> pd.DataFrame:
        """
        Fetches all bank accounts/pockets for a user.
        """
        response = supabase.table("accounts").select("*").eq("user_id", user_id).execute()
        
        if not response.data:
            return pd.DataFrame()
            
        df = pd.DataFrame(response.data)
        df['balance'] = df['balance'].astype(float)
        
        return df