FROM node:22-alpine AS build
WORKDIR /app

# Copie package.json et installe les dépendances
COPY package*.json ./
RUN npm ci

# Copie le reste et build
COPY . .
RUN npm run build -- --configuration=production

#Serve avec nginx
FROM nginx:alpine AS final
COPY --from=build /app/dist/covaldys-pilot/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80