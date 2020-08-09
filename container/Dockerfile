FROM node:lts-alpine
LABEL microfrontend="container"
COPY . /app
WORKDIR /app
EXPOSE 8000
RUN yarn --frozen-lockfile
RUN yarn build
