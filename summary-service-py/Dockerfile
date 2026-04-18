FROM python:3.12-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY app.py summary_service.py ./

EXPOSE 3001

CMD ["gunicorn", "--bind", "0.0.0.0:3001", "app:app"]
