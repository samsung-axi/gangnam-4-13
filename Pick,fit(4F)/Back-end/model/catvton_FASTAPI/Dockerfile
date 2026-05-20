FROM nvidia/cuda:11.8.0-base-ubuntu22.04
FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0

WORKDIR /app

COPY requirements.txt /app/requirements.txt 
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install fastapi[standard] uvicorn == 0.32.0

COPY . /app

ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES compute,utility

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
