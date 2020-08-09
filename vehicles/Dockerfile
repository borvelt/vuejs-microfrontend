FROM node:lts-alpine
LABEL microfrontend="app/vehicles"
COPY . /app
WORKDIR /app
EXPOSE 8002
RUN yarn --frozen-lockfile
RUN yarn build
