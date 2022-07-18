FROM node:13.12.0-alpine
WORKDIR django-project/peerplatform/peerplatform-fe
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
EXPOSE 3000