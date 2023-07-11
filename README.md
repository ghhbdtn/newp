# newp
## Node.js - v16.17.0
## npm - 8.15.0 (version)
## Установка зависимостей
```
npm install
```
 
### Компиляция (+hot reload) проекта для разработки
```
npm run serve
```

### Сборка проекта
```
npm run build
```

## Разворачивание проекта в docker:
### docker-compose.yaml файл лежит в корневой папке проекта, для запуска всех контейнеров необходимо:
```
docker-compose up
```
### Либо запустив через интерфейс среды разарботки, если такая возможность есть в используемой среде

## При запуске docker-compose.yaml файла в виртуальной машине возникает проблема с контейнером 'mongodb', поскольку не поддерживаются версии mongo 5+ (ошибка: MongoDB 5.0+ requires a CPU with AVX support), ввиду чего не происходит аутентификация пользователей. Для запуска файла в виртуальной машине необходимо в docker-compose.yaml файле в месте описания контейнера 'mongodb' изменить строку:
```
    image: mongo
```
## на строку:
```
    image: mongo:4.4.6
```
## Порт подключения к клиентскому приложению: 8081 (localhost:8081)
### Данные для входа суперпользователя: логин: admin, пароль: admin


