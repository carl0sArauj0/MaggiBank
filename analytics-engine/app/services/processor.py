import pandas as pd
from supabase import create_client, Client
from app.core.config import settings

# Initialize Supabase Client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

class DataProcessor:
    @staticmethod
    def get_user_expenses_df(user_id: str) -> pd.DataFrame:
        response = supabase.table("expenses").select("*").eq("user_id", user_id).execute()
        
        if not response.data:
            return pd.DataFrame()
            
        df = pd.DataFrame(response.data)
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
    @staticmethod
    def update_balance(account_id: str, amount: float, user_id: str):
        """
        Suma el monto al saldo actual. La lógica de 'solo sumar' 
        se garantiza aquí en el backend.
        """
        # 1. Obtener saldo actual
        res = supabase.table("accounts").select("balance").eq("id", account_id).eq("user_id", user_id).single().execute()
        if not res.data:
            return None
            
        current_balance = float(res.data['balance'])
        new_balance = current_balance + abs(amount) # abs() asegura que siempre sea positivo
        
        # 2. Actualizar
        update_res = supabase.table("accounts").update({"balance": new_balance}).eq("id", account_id).execute()
        return update_res.data

    @staticmethod
    def delete_account(account_id: str, user_id: str):
        """
        Elimina la cuenta. Gracias al ON DELETE CASCADE en SQL, 
        los gastos se borrarán solos.
        """
        res = supabase.table("accounts").delete().eq("id", account_id).eq("user_id", user_id).execute()
        return res.data

    @staticmethod
    def get_expenses_by_account(account_id: str, user_id: str):
        """Trae los gastos filtrados por cuenta."""
        res = supabase.table("expenses").select("*").eq("account_id", account_id).eq("user_id", user_id).order("date", desc=True).execute()
        return res.data