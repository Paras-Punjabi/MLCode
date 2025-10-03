FROM python:3.9-bullseye

RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

RUN mkdir /code
RUN cd /code
COPY . .

RUN pip install --no-cache-dir --upgrade pip 
RUN pip install -r requirements.txt

RUN chmod +x index.py

# Register Python kernel
RUN python -m ipykernel install --name "python3" --display-name "Python 3" --user

WORKDIR /app

EXPOSE 8888

CMD ["sh", "-c", "python /code/app.py"]

