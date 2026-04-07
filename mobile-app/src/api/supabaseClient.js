import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://reyudartvypzvamzbgnl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJleXVkYXJ0dnlwenZhbXpiZ25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3Mzg1OTIsImV4cCI6MjA5MDMxNDU5Mn0.JXppyWmB94vLFL57iHPqFXQaIP_GHQTgZ1Y-V8RzJ08';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
