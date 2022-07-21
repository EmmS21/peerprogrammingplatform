FROM python:3
ENV PYTHONUNBUFFERED 1
WORKDIR django-project/peerplatform
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
#use volume instead of copy so I don't have to rebuild the container all the time
#I can use Python Docker Image
COPY . ./
EXPOSE 8000
CMD ["python", "./manage.py", "runserver", "0.0.0.0:8000", "--settings=signup.settings"]