FROM python:3
ENV PYTHONUNBUFFERED 1
WORKDIR django-project/peerplatform
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . ./
EXPOSE 8000
CMD ["python", "./manage.py", "runserver", "0.0.0.0:8000", "--settings=signup.settings"]