FROM node:13.12.0-alpine
WORKDIR /C:/Users/15512/Desktop/django-project/peerplatform/peerplatform-fe

COPY package.json package-lock.json ./
RUN npm install
COPY . ./
EXPOSE 3000