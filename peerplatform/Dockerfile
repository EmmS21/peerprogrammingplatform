FROM python:3
ENV PYTHONUNBUFFERED 1
WORKDIR C:/Users/15512/Desktop/django-project/peerplatform
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . ./
EXPOSE 8000
CMD ["python", "./manage.py", "runserver", "0.0.1:8000", "--settings=signup.settings"]