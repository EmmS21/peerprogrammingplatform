FROM node:13.12.0
WORKDIR django-project/peerplatform/peerplatform-fe
#use node image
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
EXPOSE 3000