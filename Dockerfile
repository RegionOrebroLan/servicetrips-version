FROM node:22-alpine3.20 AS build
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . /app/
ARG configuration=production

RUN npm run ng build -- --configuration $configuration servicetrips-version

FROM docker.io/regionorebrolan/openshift-nginx:v1.27.0
COPY --from=build /app/dist/servicetrips-version/browser /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/
CMD ["nginx", "-g", "daemon off;"]
