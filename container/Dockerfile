FROM node:lts-alpine
LABEL microfrontend="container"
ARG VENDORS
ARG VUE_APP_VEHICLES_HOST
COPY . /app
WORKDIR /app
EXPOSE 8000
RUN yarn --frozen-lockfile
RUN yarn build
