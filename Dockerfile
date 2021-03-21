FROM node:14.16.0 as build

WORKDIR /app

# copy package JSONs to `/app`
COPY ./package.json ./package-lock.json ./

# install dependencies
RUN npm install

# copy `/src`, `/static`, and `index.html` to `/app`
COPY . .

# build app
RUN npm run build

FROM nginx

WORKDIR /usr/share/nginx/html

# copy app files to nginx root
COPY --from=build /app/index.html ./index.html
COPY --from=build /app/dist ./dist
COPY --from=build /app/static ./static
