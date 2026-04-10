FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Hugging Face obliga a usar el puerto 7860
EXPOSE 7860

# Ejecutamos uvicorn en el puerto 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]