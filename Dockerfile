#FROM node:lts-alpine
#
## устанавливаем простой HTTP-сервер для статики
#RUN npm install -g http-server
#
## делаем каталог 'app' текущим рабочим каталогом
#WORKDIR /app
#
## копируем оба 'package.json' и 'package-lock.json' (если есть)
#COPY *.json ./
#
## устанавливаем зависимости проекта
#RUN npm -g add @vue/cli
#RUN npm install
#
## копируем файлы и каталоги проекта в текущий рабочий каталог (т.е. в каталог 'app')
#COPY . /app
#
## собираем приложение для production с минификацией
#RUN npm run build
#
#EXPOSE 8081
#CMD [ "http-server", "dist"]


FROM node:12.2.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY *.json /app/*.json
RUN npm -g add @vue/cli
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:1.16.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
