FROM node:14
WORKDIR /app
COPY ./ /app
RUN npm config set registry https://registry.npm.taobao.org/
RUN npm install 
RUN npm run build

FROM nginx

RUN mkdir /app

COPY --from=0 /app/dist /app
