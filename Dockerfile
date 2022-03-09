# React build part
FROM node:14.16-alpine as build

WORKDIR /app
COPY . ./
RUN yarn install && yarn react-build

# Web-server deployment
FROM php:7.4-apache

# Install required extensions to connect to the database
RUN docker-php-source extract \
    && docker-php-ext-install pdo pdo_mysql \
    && docker-php-source delete

COPY --from=build /app/build /var/www/html
COPY ./api /var/www/html/api
COPY ./vendor ./vendor

COPY risking.apache.conf /etc/apache2/conf-available/risking.apache.conf
RUN ln -s /etc/apache2/conf-available/risking.apache.conf /etc/apache2/conf-enabled/risking.apache.conf

EXPOSE 80