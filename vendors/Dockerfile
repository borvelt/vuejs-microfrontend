
FROM node:lts-alpine
LABEL microfrontend="vendors"
COPY . /app
WORKDIR /app
ENV ENV=production
EXPOSE 8001
RUN yarn --frozen-lockfile
RUN yarn build
