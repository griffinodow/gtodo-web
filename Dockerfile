FROM nginx:alpine
RUN apk add --update nodejs npm
RUN mkdir /srv/build
COPY ./default.conf /etc/nginx/conf.d/default.conf
WORKDIR /srv/build
COPY ./src ./src
COPY package-lock.json .
COPY package.json .
COPY tsconfig.json .
COPY index.html .
RUN npm install --save-dev
RUN npm run build
RUN apk del nodejs npm
RUN mv ./dist/* /usr/share/nginx/html
RUN rm -rf /srv/build